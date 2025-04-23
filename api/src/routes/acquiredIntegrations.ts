import * as platform from "@nucleoidai/platform-express";

import AcquiredIntegration from "../models/AcquiredIntegration";
import { AuthenticationError } from "@nucleoidai/platform-express/error";
import Colleague from "../models/Colleague";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const { projectId: teamId } = req.session;
  const { colleagueId, teamId: queryTeamId } = req.query as {
    teamId?: string;
    colleagueId?: string;
  };

  const integrationWhere: {
    colleagueId?: string;
    teamId?: string;
  } = {};

  if (queryTeamId && queryTeamId !== teamId) {
    throw new AuthenticationError();
  }

  if (colleagueId) {
    const colleagueInstance = await Colleague.findByPk(colleagueId);

    if (!colleagueInstance) {
      throw new Error("INVALID_COLLEAGUE");
    }

    integrationWhere.colleagueId = colleagueId;
  } else if (teamId) {
    integrationWhere.teamId = teamId;
  }

  const integrationInstance = await AcquiredIntegration.findAll({
    where: integrationWhere,
  });

  const acquired = integrationInstance
    .map((integration) => integration.toJSON())
    .map(({ Colleague, ...integrationData }) => ({
      ...integrationData,
      colleagueId: integrationData.colleagueId,
      teamId: integrationData.teamId,
    }));

  res.json(acquired);
});

export default router;
