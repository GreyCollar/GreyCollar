import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NextFunction, Request, Response } from "express";
import {
  PrometheusExporter,
  PrometheusSerializer,
} from "@opentelemetry/exporter-prometheus";

import { HostMetrics } from "@opentelemetry/host-metrics";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";
import axios from "axios";
import { metrics } from "@opentelemetry/api";

const config = {
  pushgatewayUrl: process.env.PUSHGATEWAY_URL || "http://localhost:9091",
  jobName: process.env.PUSHGATEWAY_JOB || "greycollar-api",
  instance: process.env.PUSHGATEWAY_INSTANCE || "opentelemetry",
  interval: parseInt(process.env.PUSHGATEWAY_INTERVAL || "15000"),
};

class PushgatewayExporter {
  private serializer = new PrometheusSerializer();
  private url = `${config.pushgatewayUrl}/metrics/job/${config.jobName}/instance/${config.instance}`;

  async export(metrics: any, resultCallback: (result: any) => void) {
    try {
      const metricsText = this.serializer.serialize(metrics);
      if (!metricsText) {
        resultCallback({ code: 0 });
        return;
      }

      await axios.post(this.url, metricsText, {
        headers: { "Content-Type": "text/plain" },
      });
      resultCallback({ code: 0 });
    } catch (err) {
      console.error("[Pushgateway] ❌ Push failed:", (err as Error).message);
      resultCallback({ code: 1, error: err as Error });
    }
  }
}

const meterProvider = new MeterProvider({
  readers: [
    new PrometheusExporter(),
    new PeriodicExportingMetricReader({
      exporter: new PushgatewayExporter() as any,
      exportIntervalMillis: config.interval,
    }),
  ],
});

metrics.setGlobalMeterProvider(meterProvider);

new RuntimeNodeInstrumentation({
  monitoringPrecision: 5000,
}).setMeterProvider(meterProvider);

new HostMetrics({
  meterProvider,
  name: "greycollar-host-metrics",
}).start();

const meter = metrics.getMeter("greycollar-api", "1.0");

const httpMetrics = {
  requestsCounter: meter.createCounter("http_requests_total", {
    description: "Total number of HTTP requests",
  }),
  requestDurationHistogram: meter.createHistogram("http_request_duration_ms", {
    description: "Duration of HTTP requests in milliseconds",
    unit: "ms",
  }),
  errorsCounter: meter.createCounter("http_errors_total", {
    description: "Total number of HTTP errors",
  }),
  activeRequestsGauge: meter.createUpDownCounter("http_active_requests", {
    description: "Number of currently active HTTP requests",
  }),
};

meter
  .createObservableGauge("process_uptime_seconds", {
    description: "Process uptime in seconds",
  })
  .addCallback((observer) => observer.observe(process.uptime()));

export function telemetryMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    httpMetrics.activeRequestsGauge.add(1);

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const attributes = {
        method: req.method,
        endpoint: req.route?.path ?? req.path,
        status_code: res.statusCode.toString(),
      };

      httpMetrics.activeRequestsGauge.add(-1);
      httpMetrics.requestsCounter.add(1, attributes);
      httpMetrics.requestDurationHistogram.record(duration, attributes);

      if (res.statusCode >= 400) {
        httpMetrics.errorsCounter.add(1, attributes);
      }
    });

    next();
  };
}
