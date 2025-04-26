import Integrations from "../integrations/integrations.json";
import { NotFoundError } from "@nucleoidai/platform-express/error";

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
        }
      : null,
  }));
}

export default { list };
