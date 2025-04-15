import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Joi from "joi";
import Responsibility from "../models/Responsibility";
import colleague from "../functions/colleague";
import express from "express";
import responsibility from "../functions/responsibility";
import schemas from "../schemas";

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

router.post("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { title, description, colleagueId, id, nodes } = Joi.attempt(
    req.body,
    schemas.Responsibility.upsert
  );

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
    nodes
  );

  res.status(200).json(result);
});

router.put("/:responsibilityId", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { responsibilityId } = req.params;
  const { title, description, colleagueId, nodes } = Joi.attempt(
    req.body,
    schemas.Responsibility.upsert
  );

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
    nodes,
    responsibilityId
  );

  res.status(200).json(result);
});

export default router;
