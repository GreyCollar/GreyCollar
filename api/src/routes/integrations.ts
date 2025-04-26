import * as platform from "@nucleoidai/platform-express";

import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Integration from "../models/Integration";
import Joi from "joi";
import colleague from "../functions/colleague";
import express from "express";
import integration from "../functions/integration";
import integrations from "../functions/integrations";

const router = express.Router();

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId, teamId: queryTeamId } = req.query as {
    teamId?: string;
    colleagueId?: string;
  };

  if (queryTeamId && queryTeamId !== teamId) {
    throw new AuthenticationError();
  }

  if (colleagueId || queryTeamId) {
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
  } else {
    // TODO - split endpoint for all integrations
    const allIntegrations = await integrations.list();
    res.json(allIntegrations);
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  const integrationInstance = await Integration.findByPk(id);

  if (!integrationInstance) {
    throw new Error("INVALID_INTEGRATION");
  }

  await integrationInstance.update({
    accessToken: req.body.accessToken,
    refreshToken: req.body.refreshToken,
  });

  res.json(integrationInstance);
});

router.delete("/:id", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { id } = req.params;

  const integrationItem = await integration.get({
    integrationId: id,
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
