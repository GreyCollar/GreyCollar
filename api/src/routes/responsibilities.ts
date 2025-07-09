import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Responsibility from "../models/Responsibility";
import ResponsibilitySchema from "../schemas/Responsibility";
import agent from "../functions/agent";
import colleague from "../functions/colleague";
import express from "express";
import responsibility from "../functions/responsibility";

const router = express.Router();

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;

  if (!teamId) {
    return res.status(400);
  }

  const responsibilities = await Responsibility.findAll();

  res.status(200).json(responsibilities);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { projectId: teamId } = req.session;

  if (!teamId) {
    return res.status(400);
  }

  const responsibilityWithNodes = await responsibility.getWithNodes(id);

  res.status(200).json(responsibilityWithNodes);
});

router.put("/:responsibilityId", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { responsibilityId } = req.params;
  const { title, description, colleagueId, nodes } =
    ResponsibilitySchema.upsert.parse(req.body);

  if (colleagueId) {
    const { teamId: colleagueTeamId } = await colleague.get({
      colleagueId,
    });

    if (teamId !== colleagueTeamId) {
      throw new AuthenticationError();
    }
  }

  const result = await responsibility.upsert(
    title,
    description,
    colleagueId,
    responsibilityId,
    nodes
  );

  res.status(200).json(result);
});

router.delete("/:responsibilityId", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { responsibilityId } = req.params;

  const { colleagueId } = ResponsibilitySchema.delete.parse(req.body);

  if (colleagueId) {
    const { teamId: colleagueTeamId } = await colleague.get({
      colleagueId,
    });

    if (teamId !== colleagueTeamId) {
      throw new AuthenticationError();
    }
  }

  await responsibility.remove({ responsibilityId });

  res.status(200).json({ message: "Responsibility deleted" });
});

//TODO Refactor these routes when  UI is ready

router.post("/task", async (req, res) => {
  const { body } = req;

  const response = await agent.responsibilityToTask({
    history: [],
    knowledge: body.knowledge,
    content: body.content,
    responsibilities: body.responsibilities,
  });

  res.status(200).json(response);
});

router.post("/diamond", async (req, res) => {
  const { body } = req;

  const response = await agent.diamond({
    content: body.content,
    responsibilities: body.responsibilities,
  });

  res.status(200).json(response);
});

router.post("/hybrid", async (req, res) => {
  const { body } = req;

  const response = await agent.diamond({
    content: body.content,
    responsibilities: body.responsibilities,
  });

  if (response.decision === "RESPONSIBILITY") {
    const response2 = await agent.responsibilityToTask({
      history: [],
      knowledge: body.knowledge,
      content: body.content,
      responsibilities: body.responsibilities,
    });

    return res.status(200).json(response2);
  } else {
    return res.status(200).json("I'm checking the knowledge base");
  }
});

export default router;
