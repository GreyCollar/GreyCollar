import Integration from "../models/integration";
import Integrations from "../integrations/integrations";
import { NotFoundError } from "@nucleoidai/platform-express/error";
import axios from "axios";

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

async function exchangeCodeForTokens({
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

  return response.data;
}

async function updateIntegration({
  id,
  refreshToken,
}: {
  id: string;
  refreshToken: string;
}) {
  const integrationInstance = await Integration.findByPk(id);

  if (!integrationInstance) {
    throw new Error("INVALID_INTEGRATION");
  }

  await integrationInstance.update({
    refreshToken,
  });

  return integrationInstance;
}

export default { list, exchangeCodeForTokens, updateIntegration };
