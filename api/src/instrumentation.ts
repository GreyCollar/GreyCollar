import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("greycollar-api", "1.0");

let metricsData = {
  requests: 0,
  errors: 0,
  totalDuration: 0,
  requestCount: 0,
  startTime: Date.now(),
};

export const httpMetrics = {
  requestsCounter: meter.createCounter("http_requests_total", {
    description: "Total number of HTTP requests",
  }),

  requestDurationHistogram: meter.createHistogram("http_request_duration_ms", {
    description: "Duration of HTTP requests in milliseconds",
  }),

  errorsCounter: meter.createCounter("http_errors_total", {
    description: "Total number of HTTP errors",
  }),
};

export function getMetricsData() {
  return {
    ...metricsData,
    average_duration_ms:
      metricsData.requestCount > 0
        ? Math.round(metricsData.totalDuration / metricsData.requestCount)
        : 0,
    uptime_ms: Date.now() - metricsData.startTime,
  };
}

export function telemetryMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    httpMetrics.requestsCounter.add(1, {
      method: req.method,
      endpoint: req.path,
    });
    metricsData.requests++;

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      metricsData.totalDuration += duration;
      metricsData.requestCount++;

      httpMetrics.requestDurationHistogram.record(duration, {
        method: req.method,
        status_code: res.statusCode.toString(),
        endpoint: req.path,
      });

      if (res.statusCode >= 400) {
        httpMetrics.errorsCounter.add(1, {
          method: req.method,
          status_code: res.statusCode.toString(),
          endpoint: req.path,
        });
        metricsData.errors++;
      }

      if (metricsData.requestCount % 10 === 0) {
        console.log("📊 OpenTelemetry Metrics Update:", {
          total_requests: metricsData.requests,
          total_errors: metricsData.errors,
          avg_duration_ms: Math.round(
            metricsData.totalDuration / metricsData.requestCount
          ),
          last_request: `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
        });
      }
    });

    next();
  };
}

console.log("Simple OpenTelemetry metrics initialized for greycollar-api");
