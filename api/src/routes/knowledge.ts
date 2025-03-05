import * as platform from "@nucleoidai/platform-express";

import Colleague from "../models/Colleague";
import ColleagueKnowledge from "../models/ColleagueKnowledge";
import Joi from "joi";
import Knowledge from "../models/Knowledge";
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
      return res.status(401).end();
    }
  } else {
    const colleague = await Colleague.findOne({
      where: {
        teamId,
        id: colleagueId,
      },
    });

    if (!colleague) {
      return res.status(401).end();
    }
  }

  await knowledge.create({
    teamId,
    colleagueId,
    knowledge: knowledgeBody,
  });

  res.status(201).json(knowledge);
});

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const {
    colleagueId,
    type,
    teamId: queryTeamId,
  } = req.query as {
    teamId?: string;
    colleagueId?: string;
    type?: string;
  };

  if (queryTeamId && queryTeamId !== teamId) {
    return res.status(401).end();
  }

  if (colleagueId) {
    const colleagueInstance = await Colleague.findByPk(colleagueId);
    if (!colleagueInstance) {
      return res.status(404).end();
    }

    if (colleagueInstance.teamId !== teamId) {
      return res.status(401).end();
    }
  }

  const knowledgeList = await knowledge.list({
    colleagueId,
    teamId: queryTeamId,
    type,
  });
  res.json(knowledgeList);
});

router.get("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const knowledgeItem = await Knowledge.findByPk(id, {
    include: [
      {
        model: ColleagueKnowledge,
        attributes: ["teamId", "colleagueId"],
        include: [
          {
            model: Colleague,
            attributes: ["id", "teamId"],
          },
        ],
      },
    ],
  });

  if (!knowledgeItem) {
    return res.status(404).json({ message: "Knowledge not found" });
  }

  const colleagueKnowledges = Array.isArray(knowledgeItem.ColleagueKnowledge)
    ? knowledgeItem.ColleagueKnowledge
    : [knowledgeItem.ColleagueKnowledge];

  const hasAccess = colleagueKnowledges.some(
    (ck) =>
      ck.teamId === teamId || (ck.Colleague && ck.Colleague.teamId === teamId)
  );

  if (!hasAccess) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { ColleagueKnowledge: ColleagueKnowledgeData, ...knowledgeData } =
    knowledgeItem.toJSON();

  const colleagueId = ColleagueKnowledgeData?.colleagueId;

  const responseData = {
    ...knowledgeData,
    ...(colleagueId ? { colleagueId, teamId } : { teamId }),
  };

  return res.json(responseData);
});

router.delete("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const knowledgeItem = await Knowledge.findByPk(id, {
    include: [
      {
        model: ColleagueKnowledge,
        attributes: ["teamId", "colleagueId"],
        include: [
          {
            model: Colleague,
            attributes: ["id", "teamId"],
          },
        ],
      },
    ],
  });

  if (!knowledgeItem) {
    return res.status(404).json({ message: "Knowledge not found" });
  }

  const colleagueKnowledges = Array.isArray(knowledgeItem.ColleagueKnowledge)
    ? knowledgeItem.ColleagueKnowledge
    : [knowledgeItem.ColleagueKnowledge];

  const hasAccess = colleagueKnowledges.some(
    (ck) =>
      ck.teamId === teamId || (ck.Colleague && ck.Colleague.teamId === teamId)
  );

  if (!hasAccess) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  await Knowledge.destroy({ where: { id } });

  res.status(204).end();
});

export default router;
