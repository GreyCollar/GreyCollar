import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useOrganization(id?: string) {
  const [organizations, setOrganizations] = useState([]);

  const { loading, error, handleResponse } = useApi();

  // TODO - Research self-call events

  const [teamSelected] = useEvent("TEAM_SELECTED", null);

  useEffect(() => {
    if (id) {
      getOrganizationsById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSelected, id]);

  const createOrganization = useCallback(async (organization) => {
    const response = await http.post("/organizations", organization);
    publish("ORGANIZATION_CREATED", { organization: response.data });

    return response.data;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrganizationsById = useCallback((id) => {
    if (!id) {
      return;
    }
    handleResponse(
      http.get(`/organizations/${id}`),
      (response) => setOrganizations(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    createOrganization,
    organizations,
    loading,
    error,
  };
}

export default useOrganization;
