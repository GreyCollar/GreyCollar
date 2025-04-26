import {
  NotFoundError,
  ValidationError,
} from "@nucleoidai/platform-express/error";

import Colleague from "../models/Colleague";
import Integration from "../models/Integration";

async function list({
  colleagueId,
  teamId,
}: {
  teamId?: string;
  colleagueId?: string;
}) {
  const integrationWhere: {
    colleagueId?: string;
    teamId?: string;
  } = {};

  if (colleagueId) {
    const colleagueInstance = await Colleague.findByPk(colleagueId);

    if (!colleagueInstance) {
      throw new Error("INVALID_COLLEAGUE");
    }

    integrationWhere.colleagueId = colleagueId;
  } else if (teamId) {
    integrationWhere.teamId = teamId;
  }

  const integrationInstance = await Integration.findAll({
    where: integrationWhere,
  });

  return integrationInstance
    .map((integration) => integration.toJSON())
    .map(({ Colleague, ...integrationData }) => ({
      ...integrationData,
      colleagueId: integrationData.colleagueId,
      teamId: integrationData.teamId,
    }));
}

async function get({ integrationId }: { integrationId: string }) {
  const integrationItem = await Integration.findByPk(integrationId);

  if (!integrationItem) {
    throw new NotFoundError();
  }

  return integrationItem.toJSON();
}

export default { list, get };
