import {
  NotFoundError,
  ValidationError,
} from "@nucleoidai/platform-express/error";

import Colleague from "../models/Colleague";
import Integration from "../models/Integration";
import Integrations from "../integrations/integrations";
import axios from "axios";

async function read({
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

async function create({
  code,
  clientId,
  clientSecret,
  redirectUri,
  tokenUrl,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tokenUrl: string;
}) {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");

  const response = await axios.post(tokenUrl, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokens = response.data;

  return tokens;
}

async function list() {
  if (!Integrations || Integrations.length === 0) {
    throw new NotFoundError();
  }

  return Integrations.map((provider) => ({
    id: provider.id,
    provider: provider.provider,
    description: provider.description,
    action: provider.action,
    direction: provider.direction,
    oauth: provider.oauth
      ? {
          scope: provider.oauth.scope,
          tokenUrl: provider.oauth.tokenUrl,
          clientId: provider.oauth.clientId,
          redirectUri: provider.oauth.redirectUri,
        }
      : null,
  }));
}

async function get({ integrationId }: { integrationId: string }) {
  const integrationItem = await Integration.findByPk(integrationId);

  if (!integrationItem) {
    throw new NotFoundError();
  }

  return integrationItem.toJSON();
}

export default { read, get, create, list };
