import Colleague from "../models/Colleague";
import Conversation from "../models/Conversation";
import Joi from "joi";
import Supervising from "../models/Supervising";
import agent from "../functions/agent";
import express from "express";
import { publish } from "../lib/Event";
import schemas from "../schemas";
import session from "../functions/session";
import supervising from "../functions/supervising";

const router = express.Router();

router.post("/", async (req, res) => {
  const teamId = req.session.projectId;

  const { sessionId, conversationId, colleagueId } = Joi.attempt(
    req.body,
    schemas.Supervising.create
  );

  const colleague = await Colleague.findByPk(colleagueId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    res.status(404);
  }

  const createdSupervising = await supervising.create({
    sessionId,
    conversationId,
    question: conversation.content,
    colleagueId,
  });

  res.status(201).json(createdSupervising);
});

router.get("/", async (req, res) => {
  const teamId = req.session.projectId;
  const { status } = req.query;

  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }

  const supervisings = await Supervising.findAll({
    where: whereClause,
    include: [
      {
        model: Colleague,
        where: { teamId },
        attributes: [],
      },
    ],
  });

  if (status && supervisings.length === 1) {
    const supervisingData = supervisings[0].dataValues;

    const formattedData = {
      ...supervisingData,
      createdAt: supervisingData.createdAt?.toISOString(),
    };
    publish("SUPERVISING_LOADED", formattedData);
  } else if (status && supervisings.length === 0) {
    publish("SUPERVISING_LOADED", null);
  } else {
    publish("SUPERVISING_LOADED", supervisings);
  }

  res.status(200).json(supervisings);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const teamId = req.session.projectId;

  const validatedId = Joi.attempt(id, Joi.string().guid().required());

  const supervising = await Supervising.findOne({
    where: { id: validatedId },
    include: [
      {
        model: Colleague,
        attributes: ["teamId"],
        required: true,
      },
    ],
  });

  if (!supervising) {
    res.status(404);
  }

  if (supervising.Colleague.teamId !== teamId) {
    res.status(401);
  }

  const { dataValues } = supervising;

  if (dataValues.Colleague) {
    // eslint-disable-next-line no-unused-vars
    const { Colleague, ...rest } = dataValues;
    res.status(200).json(rest);
    publish("SUPERVISING_LOADED", rest);
  } else {
    res.status(200).json(dataValues);
    publish("SUPERVISING_LOADED", dataValues);
  }
});

router.patch("/:supervisingId", async (req, res) => {
  const { supervisingId } = req.params;
  const teamId = req.session.projectId;

  const { answer, status } = Joi.attempt(req.body, schemas.Supervising.patch);

  const supervisingInstance = await Supervising.findByPk(supervisingId);

  if (!supervisingInstance) {
    return res.status(404);
  }

  const colleague = await Colleague.findByPk(supervisingInstance.colleagueId);

  if (!colleague) {
    return res.status(404);
  }

  if (colleague.teamId !== teamId) {
    return res.status(401);
  }

  const updatedSupervising = await supervising.update({
    teamId,
    supervisingId,
    colleagueId: colleague.id,
    question: supervisingInstance.question,
    answer,
    status,
  });

  res.status(200).json(updatedSupervising);
});

router.post("/:supervisingId/evaluate", async (req, res) => {
  const { supervisingId } = req.params;
  const teamId = req.session.projectId;

  const { answer } = Joi.attempt(
    req.body,
    Joi.object({
      answer: Joi.string().required(),
    })
  );

  const supervisingInstance = await Supervising.findByPk(supervisingId);

  if (!supervisingInstance) {
    return res.status(404).json({ error: "Supervising not found" });
  }

  const colleague = await Colleague.findByPk(supervisingInstance.colleagueId);

  if (!colleague) {
    return res.status(404).json({ error: "Colleague not found" });
  }

  if (colleague.teamId !== teamId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const evaluation = await agent.evaluateSupervisionAnswer({
      colleagueId: colleague.id,
      content: {
        question: supervisingInstance.question,
        answer,
      },
    });

    if (evaluation.is_answer_known) {
      const updatedSupervising = await supervising.update({
        teamId,
        supervisingId,
        colleagueId: colleague.id,
        question: supervisingInstance.question,
        answer,
        status: "ANSWERED",
      });

      return res.status(200).json({
        action: "answer_approved",
        supervising: updatedSupervising,
        evaluation: {
          ...evaluation,
        },
      });
    } else {
      return res.status(200).json({
        action: "needs_improvement",
        evaluation: {
          ...evaluation,
        },
      });
    }
  } catch (error) {
    console.error("Error evaluating supervising answer:", error);
    return res.status(500).json({
      error: "Failed to evaluate answer",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
