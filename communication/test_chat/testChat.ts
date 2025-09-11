import { createSession } from "../api/createSession";
import { event } from "node-event-test-package/client";
import express from "express";
import { getColleague } from "../api/getColleague";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
import { sendMessageToSession } from "../api/sendMessageSession";

const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  try {
    let token;
    const colleagueId = process.env.COLLEAGUE_ID;
    const decoded = { aud: process.env.PROJECT_ID };

    if (!colleagueId) {
      return res.status(400).json({ error: "Missing colleagueId" });
    }

    const sessionData = await createSession(token, colleagueId);
    const colleague = await getColleague(token, colleagueId);

    if (!colleague || colleague.teamId !== decoded?.aud) {
      return res
        .status(403)
        .json({ error: "Colleague not found or team ID mismatch" });
    }

    const content: string =
      (req.body?.content as string) || "Where is the parking lot?";


    const messageResponse = await sendMessageToSession(
      sessionData.id,
      token,
      content
    );

    return res.status(200).json({
      status: "success",
      session: sessionData,
      colleague,
      message: messageResponse,
    });

    
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Unknown error" });
  }
});

export default router;

