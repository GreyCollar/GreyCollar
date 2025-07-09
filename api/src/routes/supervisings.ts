import Colleague from "../models/Colleague";
import Conversation from "../models/Conversation";
import Joi from "joi";
import Supervising from "../models/Supervising";
import express from "express";
import { publish } from "../lib/Event";
import schemas from "../schemas";
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

  if (!supervising) {
    res.status(404);
  }

  const colleague = await Colleague.findByPk(supervisingInstance.colleagueId);

  if (!colleague) {
    res.status(404);
  }

  if (colleague.teamId !== teamId) {
    res.status(401);
  }

  await supervising.update({
    teamId,
    supervisingId,
    colleagueId: colleague.id,
    question: supervisingInstance.question,
    answer,
    status,
  });

  res.status(200).json(supervising);
});

export default router;
