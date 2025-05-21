import * as platform from "@nucleoidai/platform-express";

import Colleague from "../models/Colleague";
import Joi from "joi";
import Session from "../models/Session";
import Supervising from "../models/Supervising";
import agent from "../functions/agent";
import express from "express";
import schemas from "../schemas";

const router = express.Router();

router.post("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { body } = req;

  const validatedBody = Joi.attempt(body, schemas.Colleague);

  validatedBody.teamId = teamId;

  const colleague = await Colleague.create(validatedBody);

  res.status(201).json(colleague);
});

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;

  const colleagues = await Colleague.findAll({
    where: { teamId },
    attributes: { exclude: ["aiEngineId"] },
    include: ["AIEngine"],
  });

  res.json(colleagues);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { projectId: teamId } = req.session;
  const { body } = req;

  const validatedId = Joi.attempt(id, Joi.string().guid().required());
  const validatedBody = Joi.attempt(body, schemas.Colleague);

  const colleague = await Colleague.findByPk(validatedId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  await colleague.update(validatedBody);

  res.json(colleague);
});

router.get("/:colleagueId", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId } = req.params;

  const validatedId = Joi.attempt(colleagueId, Joi.string().guid().required());

  const colleague = await Colleague.findByPk(validatedId, {
    attributes: { exclude: ["aiEngineId"] },
    include: ["AIEngine"],
  });

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  res.json(colleague);
});

router.delete("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const validatedId = Joi.attempt(id, Joi.string().guid().required());

  const colleague = await Colleague.findByPk(validatedId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  await colleague.destroy();

  res.status(204).end();
});

router.get("/:colleagueId/sessions", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId } = Joi.attempt(
    req.params,
    Joi.object({ colleagueId: Joi.string().guid().required() })
  );

  const colleague = await Colleague.findByPk(colleagueId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  const sessions = await Session.findAll({ where: { colleagueId } });

  res.json(sessions);
});

router.get("/:colleagueId/supervisings", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId } = req.params;

  const { status } = Joi.attempt(
    req.query,
    Joi.object({
      status: Joi.string().valid("ANSWERED", "IN_PROGRESS").optional(),
    })
  );

  const colleague = await Colleague.findByPk(colleagueId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  const where = { colleagueId } as {
    colleagueId: string;
    status?: string;
  };

  if (status) {
    where.status = status;
  }

  const supervisings = await Supervising.findAll({ where });

  res.json(supervisings);
});

router.post("/responsibilities", async (req, res) => {
  const { body } = req;

  const history = body?.history;
  const content = body.content;

  const response = await agent.responsibility({
    history: history ? history : [],
    content,
  });

  res.json({
    response: response.response,
    flow: response.flow,
  });
});

export default router;
