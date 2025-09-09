import { Server } from "socket.io";
import { createApp } from "./app";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { event } from "@nucleoidai/node-event/client";
import express from "express";
import http from "http";
import session from "./test_chat/session";

dotenv.config();

const startServer = async () => {

  await event.init({
    type: "kafka",
    clientId: "greycollar",
    brokers: [
      "event.internal.gentleflower-99ef02e0.eastus.azurecontainerapps.io:9092",
    ],
    groupId: "greycollar",
  });

  const mainApp = express();

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
  });

  server.listen(scoketIoPort, () => {
    console.log(`⚡️ Socket.io server running on port ${scoketIoPort}`);
  });
};

startServer().catch(console.error);
