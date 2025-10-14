import "./src/instrumentation";

import * as platform from "@canmingir/link-express";

import config from "./config";
import dotenv from "dotenv";
import { event } from "node-event-test-package/client";
import http from "http";
import models from "./src/models";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
  console.log(`Unhandled Rejection: ${reason}`);
});

platform.init(config).then(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require("./src/app").default;
  const server = http.createServer(app);

  models.init();

  await event.init({
    type: "kafka",
    clientId: "greycollar",
    brokers: ["20.55.19.45:9092"],
    groupId: "greycollar",
    // type: "inMemory",
    // host: "localhost",
    // protocol: "http",
    // port: 8080,
  });

  const pushgatewayConfig = {
    url: process.env.PUSHGATEWAY_URL || "http://localhost:9091",
    jobName: process.env.PUSHGATEWAY_JOB || "greycollar-api",
    instance: process.env.PUSHGATEWAY_INSTANCE || `node-events`,
    interval: parseInt(process.env.PUSHGATEWAY_INTERVAL || "15000"),
  };

  try {
    event.startPushgateway(pushgatewayConfig);
    console.log(
      `Started automatic metrics pushing to pushgateway: ${pushgatewayConfig.url}`
    );
  } catch (error) {
    console.error("Failed to start pushgateway:", error);
  }

  server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});
