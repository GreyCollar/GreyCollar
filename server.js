const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

const apiProxy = createProxyMiddleware({
  target: "http://localhost:4000",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
  onError: (err, req, res) => {
    console.error("Proxy Error:", {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      headers: req.headers,
    });
    res.status(500).send("Proxy Error: " + err.message);
  },
  logLevel: "debug",
  logProvider: (provider) => ({
    log: (...args) => console.log("[Proxy]", ...args),
    debug: (...args) => console.debug("[Proxy Debug]", ...args),
    info: (...args) => console.info("[Proxy Info]", ...args),
    warn: (...args) => console.warn("[Proxy Warning]", ...args),
    error: (...args) => console.error("[Proxy Error]", ...args),
  }),
  proxyTimeout: 120000,
  timeout: 120000,
});

const dashboardProxy = createProxyMiddleware({
  target: "http://localhost:5173",
  changeOrigin: true,
  ws:true,
  onError: (err, req, res) => {
    console.error("Dashboard Proxy Error:", {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    res.status(500).send("Dashboard Proxy Error: " + err.message);
  },
});

app.use((err, req, res, next) => {
  console.error("Global Error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).send("Server Error: " + err.message);
});

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.use("/api", apiProxy);
app.use("/", dashboardProxy);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
