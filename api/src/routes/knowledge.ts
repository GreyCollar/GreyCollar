import * as platform from "@nucleoidai/platform-express";

import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Colleague from "../models/Colleague";
import Joi from "joi";
import Knowledge from "../models/Knowledge";
import colleague from "../functions/colleague";
import express from "express";
import knowledge from "../functions/knowledge";
import schemas from "../schemas";

const router = express.Router();

router.post("/", async (req, res) => {
  const { body } = req;
  const { projectId: teamId } = req.session;

  const {
    colleagueId,
    teamId: knowledgeTeamId,
    ...knowledgeBody
  } = Joi.attempt(body, schemas.Knowledge.create);

  if (knowledgeTeamId) {
    if (knowledgeTeamId !== teamId) {
      throw new AuthenticationError();
    }
  } else {
    const colleague = await Colleague.findOne({
      where: {
        teamId,
        id: colleagueId,
      },
    });

    if (!colleague) {
      throw new AuthenticationError();
    }
  }

  const createdKnowledge = await knowledge.create({
    teamId,
    colleagueId,
    knowledge: knowledgeBody,
  });

  res.status(201).json(createdKnowledge);
});

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId, type } = req.query as {
    teamId?: string;
    colleagueId?: string;
    type?: string;
  };

  if (colleagueId) {
    const colleagueInstance = await colleague.get({ colleagueId });

    if (colleagueInstance.teamId !== teamId) {
      throw new AuthenticationError();
    }
  }

  const knowledgeList = await knowledge.list({
    colleagueId,
    teamId,
    type,
  });

  res.json(knowledgeList);
});

router.get("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const knowledgeItem = await knowledge.get({
    knowledgeId: id,
    includeColleague: true,
  });

  const { ColleagueKnowledge } = knowledgeItem;

  const hasAccess =
    ColleagueKnowledge.teamId === teamId ||
    ColleagueKnowledge.Colleague?.teamId === teamId;

  if (!hasAccess) {
    throw new AuthenticationError();
  }

  const { colleagueId } = ColleagueKnowledge;

  delete knowledgeItem.ColleagueKnowledge;

  const responseData = {
    ...knowledgeItem,
    ...(colleagueId ? { colleagueId, teamId } : { teamId }),
  };

  return res.json(responseData);
});

router.delete("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const knowledgeItem = await knowledge.get({
    knowledgeId: id,
    includeColleague: true,
  });

  const { ColleagueKnowledge } = knowledgeItem;

  const hasAccess =
    ColleagueKnowledge.teamId === teamId ||
    ColleagueKnowledge.Colleague?.teamId === teamId;

  if (!hasAccess) {
    throw new AuthenticationError();
  }

  await Knowledge.destroy({ where: { id } });

  res.status(204).end();
});

export default router;
