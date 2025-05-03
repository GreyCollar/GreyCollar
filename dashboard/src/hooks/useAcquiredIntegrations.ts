import http from "../http";
import useApi from "./useApiV2";
import { useCallback } from "react";

import { publish, useEvent } from "@nucleoidai/react-event";

export type Integration = {
  id: string;
  refreshToken: string;
};

function useIntegrations() {
  const { Api } = useApi();

  const [authorized] = useEvent("INTEGRATION_UPDATED", null);

  const getTokens = async (code: string, integration) => {
    const response = await http.post(`/integrations`, {
      code: code,
      integrationId: integration.id,
    });

    publish("AUTHORIZED", {});

    return response.data;
  };

  const getIntegrations = useCallback(() => {
    const { data, loading, error } = Api(() => http.get(`/integrations`), []);

    if (data) {
      publish("INTEGRATIONS_LOADED", {
        integrations: data,
      });
    }

    return {
      integrations: data,
      loading,
      error,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAcquiredIntegrations = useCallback(
    (teamId: string) => {
      const { data, loading, error } = Api(
        () => http.get(`/integrations?teamId=${teamId}`),
        [authorized]
      );

      if (data) {
        publish("ACQUIRED_INTEGRATIONS_LOADED", {
          acquiredIntegrations: data,
        });
      }

      return {
        acquiredIntegrations: data,
        loading,
        error,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getColleagueAcquiredIntegrations = useCallback(
    (colleagueId: string) => {
      const { data, loading, error } = Api(
        () => http.get(`/integrations?colleagueId=${colleagueId}`),
        []
      );

      if (data) {
        publish("COLLEAGUE_ACQUIRED_INTEGRATIONS_LOADED", {
          acquiredIntegrations: data,
        });
      }

      return {
        acquiredIntegrations: data,
        loading,
        error,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    getIntegrations,
    getAcquiredIntegrations,
    getColleagueAcquiredIntegrations,
    getTokens,
  };
}

export default useIntegrations;
