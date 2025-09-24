import { AuthenticationError } from "@canmingir/link-express/error";
import Responsibility from "../models/Responsibility";
import ResponsibilitySchema from "../schemas/Responsibility";
import agent from "../functions/agent";
import colleague from "../functions/colleague";
import { event } from "node-event-test-package/client";
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

  const pseudo = await agent.toPseudo({
    content: result.description,
  });

  await responsibility.patch({
    responsibilityId,
    pseudo,
  });

  await event.publish("RESPONSIBILITY_CREATED", {
    responsibility: { ...result, pseudo },
  });

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

export default router;

