import Statistics from "../models/Statistics";
import express from "express";
import platform from "@nucleoidai/platform-express";
import { v4 as uuid } from "uuid";
const router = express.Router();

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;

  if (!teamId) {
    return res.status(400);
  }

  let statistics = await Statistics.findOne({ where: { teamId } });

  if (!statistics) {
    const defaultStatistics = {
      id: uuid(),
      responseRate: 0,
      supervisingRate: 0,
      knowledgeSize: 0,
      taskCount: 0,
      totalMessages: 0,
      teamId: teamId,
    };

    await Statistics.create(defaultStatistics);

    statistics = await Statistics.findOne({ where: { teamId } });
  }

  res.status(200).json(statistics);
});

export default router;
