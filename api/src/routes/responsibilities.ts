import Responsibilities from "../models/Responsibilities";
import express from "express";
import platform from "@nucleoidai/platform-express";

const router = express.Router();

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;

  if (!teamId) {
    return res.status(400);
  }

  let responsibilities = await Responsibilities.findAll();

  res.status(200).json(responsibilities);
});

export default router;
