import { client } from "@nucleoidai/node-event";
import express from "express";
import { getMetricsData } from "../instrumentation";
import os from "os";
import platform from "@canmingir/link-express";
const router = express.Router();

router.get("/prometheus", async (req, res) => {
  try {
    const baseMetrics = await client.register.metrics();
    const metricsData = getMetricsData();

    const opentelemetryMetrics = `http_requests_total ${metricsData.requests}
     http_errors_total ${metricsData.errors}
     http_request_duration_avg_ms ${metricsData.average_duration_ms}
     total_requests_processed ${metricsData.requestCount}
     uptime_ms ${metricsData.uptime_ms}
     uptime_seconds ${Math.round(metricsData.uptime_ms / 1000)}
`;

    const combinedMetrics = baseMetrics + opentelemetryMetrics;
    res.set("Content-Type", client.register.contentType);
    res.end(combinedMetrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to collect metrics" });
  }
});

router.get("/", (req, res) => {
  res.json({
    free: os.freemem(),
    total: os.totalmem(),
  });
});

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
