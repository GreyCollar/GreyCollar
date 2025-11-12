import { Server } from "socket.io";
import config from "./config";
import { createApp } from "./app";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { event } from "node-event-test-package/client";
import express from "express";
import http from "http";
import session from "./test_chat/session";
import testChat from "./test_chat/testChat";

//import kafkaConfig from "./config.kafka";
//import txqConfig from "./config.txq";

dotenv.config();

const startServer = async () => {
  await event.init(config.event);
  const mainApp = express();

  const testApp = express();

  const slackApp = createApp();

  const slackPort = process.env.SLACK_PORT || 3002;

  await slackApp.start(slackPort);

  const slackProxy = createProxyMiddleware({
    target: `http://localhost:${slackPort}`,
    ws: true,
    pathRewrite: {
      "^/bot": "",
    },
  });

  mainApp.use("/bot", slackProxy);
  mainApp.use("/test-chat", testChat);

  const server = http.createServer(mainApp);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  session.setup(io);

  const mainPort = process.env.MAIN_PORT || 3001;
  const scoketIoPort = process.env.SOCKET_IO_PORT || 3003;

  mainApp.listen(mainPort, () => {
    console.log(`⚡️ Main server running on port ${mainPort}`);
    console.log(`⚡️ Bot app accessible at /bot`);
    console.log(`⚡️ Chat app accessible at /chat`);
    console.log(`⚡️ Test app accessible at /test-chat`);
  });

  server.listen(scoketIoPort, () => {
    console.log(`⚡️ Socket.io server running on port ${scoketIoPort}`);
  });
};

startServer().catch(console.error);
