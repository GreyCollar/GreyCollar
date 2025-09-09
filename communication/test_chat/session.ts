import { Server } from "socket.io";
import { createSession } from "../api/createSession";
import dotenv from "dotenv";
import { event } from "node-event-test-package/client";
import { getColleague } from "../api/getColleague";
import jwt from "jsonwebtoken";
import { sendMessageToSession } from "../api/sendMessageSession";

const sockets = {};
dotenv.config();

export type Colleague = {
  id: string;
  teamId: string;
  name: string;
};

export type Session = {
  id: string;
  colleagueId: string;
};

const setup = async (io: Server) => {
  io.on("connection", async (socket) => {
    try {
      console.log("New socket connection:", socket.id);
      const token = socket.handshake.auth.token;
      const colleagueId = socket.handshake.query.colleagueId as string;

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is required");
      }

      const decoded = jwt.verify(token, jwtSecret);

      if (typeof decoded !== "object" || decoded === null) {
        throw new Error(
          "Invalid JWT payload: expected an object, got a string"
        );
      }

      const session: Session = await createSession(token, colleagueId);
      const colleague: Colleague = await getColleague(token, colleagueId);

      if (!colleague || colleague.teamId !== decoded.aud) {
        socket.disconnect();
        return;
      }

      socket.on("disconnect", () => {
        delete sockets[session.id];
      });

      sockets[session.id] = socket.id;

      socket.on("customer_message", async ({ content }, callback) => {
        console.log("Customer message received:", content);
        await sendMessageToSession(session.id, token, content);

        callback({ status: "success" });
      });
    } catch (err) {
      socket.disconnect();
      console.error(err);
    }
  });

  io.on("error", (err) => {
    console.error("Socket error:", err);
  });

  await event.subscribe("SESSION_AI_MESSAGED", ({ sessionId, content }) => {
    console.log("subscribed AI_MESSAGED", sessionId, content);
    const socketId = sockets[sessionId];
    if (socketId) {
      io.to(socketId).emit("ai_message", {
        content,
      });
    }
  });
};

export default { setup };
