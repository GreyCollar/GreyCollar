import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useIntegrations(colleagueId?: string) {
  const [integrations, setIntegrations] = useState([
    {
      id: "",
      provider: "",
      icon: "",
      scope: "",
      description: "",
      accessToken: "",
      colleagueId: "",
      teamId: "",
      acquired: false,
    },
  ]);

  const [colleagueIntegrations, setColleagueIntegrations] = useState([
    {
      id: "",
      provider: "",
      icon: "",
      scope: "",
      description: "",
      direction: "",
      accessToken: "",
      colleagueId: "",
      teamId: "",
      acquired: false,
    },
  ]);

  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    if (colleagueId) {
      getColleagueIntegration(colleagueId);
    }

    getIntegrations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIntegrations = useCallback(() => {
    handleResponse(
      http.get(`/integrations`),
      (response) => {
        setIntegrations(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColleagueIntegration = useCallback((colleagueId) => {
    handleResponse(
      http.get(`/integrations?colleagueId=${colleagueId}`),
      (response) => {
        setColleagueIntegrations(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    integrations,
    colleagueIntegrations,
  };
}

export default useIntegrations;
