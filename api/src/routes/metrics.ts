import { client } from "@nucleoidai/node-event";
import express from "express";
import os from "os";
import platform from "@canmingir/link-express";
const router = express.Router();

router.get("/prometheus", async (req, res) => {
  try {
    const metrics = await client.register.metrics();
    res.set("Content-Type", client.register.contentType);
    res.end(metrics);
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
