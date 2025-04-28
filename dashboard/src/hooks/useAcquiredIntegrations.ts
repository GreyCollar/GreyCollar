import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApiV2";
import { useCallback } from "react";

export type Integration = {
  id: string;
  refreshToken: string;
};

function useIntegrations() {
  const { Api } = useApi();

  const getTokens = async (code: string, integration) => {
    const response = await http.post(`/integrations/${integration.id}`, {
      code: code,
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
        []
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

  const updateIntegration = useCallback(
    async (integration: Integration) => {
      const response = await http.patch(`/integrations/${integration.id}`, {
        refreshToken: integration.refreshToken,
      });

      if (response && response.data) {
        publish("INTEGRATION_ACQUIRED", {
          integration: integration,
        });
      }

      return response.data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    getIntegrations,
    updateIntegration,
    getAcquiredIntegrations,
    getColleagueAcquiredIntegrations,
    getTokens,
  };
}

export default useIntegrations;
