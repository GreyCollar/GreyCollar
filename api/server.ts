import * as platform from "@canmingir/link-express";

import { Server } from "socket.io";
import config from "./config";
import dotenv from "dotenv";
import http from "http";
import models from "./src/models";
import { nodeEvent } from "nuc-node-event-test/client";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
  console.log(`Unhandled Rejection: ${reason}`);
});

platform.init(config).then(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require("./src/app").default;
  const server = http.createServer(app);

  models.init();

  nodeEvent.init({
    host: "localhost",
    port: Number(8080),
    protocol: "http",
  });

  server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});
