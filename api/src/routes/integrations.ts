import * as platform from "@nucleoidai/platform-express";

import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Integration from "../models/Integration";
import Joi from "joi";
import colleague from "../functions/colleague";
import express from "express";
import integration from "../functions/integration";
import schemas from "../schemas";

const router = express.Router();

router.post("/", async (req, res) => {
  const { body } = req;
  const { projectId: teamId } = req.session;

  const {
    colleagueId,
    teamId: integrationTeamId,
    ...integrationBody
  } = Joi.attempt(body, schemas.Integration.create);

  if (integrationTeamId) {
    if (integrationTeamId !== teamId) {
      throw new AuthenticationError();
    }
  }

  const integrations = await integration.create({
    teamId,
    colleagueId,
    integration: integrationBody,
  });

  res.status(201).json(integrations);
});

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId } = req.query as {
    teamId?: string;
    colleagueId?: string;
  };

  if (colleagueId) {
    const colleagueInstance = await colleague.get({ colleagueId });

    if (colleagueInstance.teamId !== teamId) {
      throw new AuthenticationError();
    }
  }

  const integrationList = await integration.list({
    colleagueId: colleagueId || undefined,
    teamId,
  });

  res.json(integrationList);
});

router.delete("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const integrationItem = await integration.get({
    integrationId: id,
    includeColleague: true,
  });

  const { Colleague } = integrationItem;

  const hasAccess =
    (Colleague && Colleague.teamId === teamId) ||
    integrationItem.teamId === teamId;

  if (!hasAccess) {
    throw new AuthenticationError();
  }

  await Integration.destroy({ where: { id } });

  res.status(204).end();
});

export default router;
