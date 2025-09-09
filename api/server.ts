import * as platform from "@canmingir/link-express";

import config from "./config";
import dotenv from "dotenv";
import { event } from "@nucleoidai/node-event/client";
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
    brokers: ["event:9092"],
    groupId: "greycollar",
  });

  server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});

