import {
  NotFoundError,
  ValidationError,
} from "@nucleoidai/platform-express/error";

import Colleague from "../models/Colleague";
import Integration from "../models/Integration";

async function create({
  teamId,
  colleagueId,
  integration,
}: {
  teamId?: string;
  colleagueId?: string;
  integration: {
    provider: string;
    scope: string;
    description: string;
    direction: string;
    acquired?: boolean;
    colleagueId?: string;
    teamId?: string;
  };
}) {
  if (!teamId && !colleagueId) {
    throw new ValidationError();
  }

  if (colleagueId) {
    const colleagueInstance = await Colleague.findByPk(colleagueId);
    if (!colleagueInstance) {
      throw new NotFoundError();
    }

    integration.colleagueId = colleagueId;
  }

  if (teamId) {
    integration.teamId = teamId;
  }

  const integrationInstance = await Integration.create(integration);

  const integrationData = integrationInstance.toJSON();

  return {
    ...integrationData,
    colleagueId: colleagueId || null,
    teamId: teamId || null,
  };
}

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
  const includeOptions: {
    model: any;
    attributes: string[];
    required: boolean;
  }[] = [];

  const integrationItem = await Integration.findByPk(integrationId, {
    include: includeOptions,
  });

  if (!integrationItem) {
    throw new NotFoundError();
  }

  return integrationItem.toJSON();
}

export default { create, list, get };
