import * as platform from "@nucleoidai/platform-express";

import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Integration from "../models/Integration";
import Integrations from "../integrations/integrations";
import Joi from "joi";
import colleague from "../functions/colleague";
import express from "express";
import integration from "../functions/integration";
import integrations from "../functions/integrations";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const { code } = req.body;

  const { id } = req.params;

  const integrationAuth = Integrations.find(
    (integration) => integration.id === id
  );

  if (!integrationAuth) {
    throw new platform.NotFoundError();
  }

  const { clientId, clientSecret, redirectUri, tokenUrl } =
    integrationAuth.oauth;

  const tokens = await integrations.exchangeCodeForTokens({
    code,
    clientId: clientId ?? "",
    clientSecret: clientSecret ?? "",
    redirectUri: redirectUri ?? "",
    tokenUrl: tokenUrl,
  });

  res.json(tokens);
});

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
  const { refreshToken } = req.body;

  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  const { error } = schema.validate({ refreshToken });

  if (error) {
    throw new platform.BadRequestError(error.message);
  }

  const updatedIntegration = await integrations.updateIntegration({
    id,
    refreshToken,
  });

  res.json(updatedIntegration);
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
