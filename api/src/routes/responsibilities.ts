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
  const { title, description, colleagueId } = Joi.attempt(
    req.body,
    schemas.Responsibility.create
  );
  const { teamId: colleagueTeamId } = await colleague.get({
    colleagueId,
  });
  if (teamId !== colleagueTeamId) {
    throw new AuthenticationError();
  }
  const result = await responsibility.createResponsibility(
    title,
    description,
    colleagueId
  );

  res.status(200).json(result);
});

router.post("/:responsibilityId", async (req, res) => {
  const { responsibilityId } = req.params;
  const { projectId: teamId } = req.session;
  const nodes = Joi.attempt(req.body, schemas.ResponsibilityNode.create);
  console.log(nodes);
  const result = await responsibility.connectResponsibilityWithNodes(
    responsibilityId,
    nodes
  );

  res.status(200).json(result);
});

export default router;
