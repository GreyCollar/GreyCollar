import "./src/instrumentation";

import * as platform from "@canmingir/link-express";

import config from "./config";
import dotenv from "dotenv";
import { event } from "node-event-test-package/client";
import http from "http";
import models from "./src/models";

//import kafkaConfig from "./config.kafka";
//import txqConfig from "./config.txq";

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

  await event.init(config.event);

  if (config.metrics.enabled) {
    event.startPushgateway({
      url: config.metrics.url,
      jobName: config.metrics.pushGatewayNodeEvents.jobName,
      instance: config.metrics.pushGatewayNodeEvents.instance,
      interval: config.metrics.interval,
    });
  }

  server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});
