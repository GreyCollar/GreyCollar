import * as platform from "@nucleoidai/platform-express";

import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Integration from "../models/Integration";
import Integrations from "../integrations/integrations";
import colleague from "../functions/colleague";
import express from "express";
import integration from "../functions/integration";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    authorizationCode,
    mcpId,
    teamId,
    colleagueId,
  }: {
    authorizationCode: string;
    mcpId: string;
    teamId?: string;
    colleagueId?: string;
  } = req.body;

  const createData: any = {
    authorizationCode,
    mcpId,
  };

  if (teamId) {
    createData.teamId = teamId;
  } else if (colleagueId) {
    createData.colleagueId = colleagueId;
  }

  const tokens = await integration.create(createData);

  res.json({ tokens });
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

    const integrationList = await integration.read({
      colleagueId: colleagueId || undefined,
      teamId,
    });

    res.json(integrationList);
  } else {
    // TODO - split endpoint for all integrations
    const allIntegrations = await integration.list();
    res.json(allIntegrations);
  }
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
