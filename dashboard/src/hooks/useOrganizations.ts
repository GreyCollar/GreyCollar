import http from "../http";
import useApi from "./useApi";
import { useEvent } from "@nucleoidai/react-event";

import { useCallback, useEffect, useState } from "react";

function useOrganizations() {
  const [organizations, setOrganizations] = useState<
    {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }[]
  >([
    {
      id: "",
      name: "",
      description: "",
      created_at: "",
      updated_at: "",
    },
  ]);

  const { loading, error, handleResponse } = useApi();

  const [teamSelected] = useEvent("TEAM_SELECTED", null);
  const [organizationCreated] = useEvent("ORGANIZATION_CREATED", {
    organization: null,
  });

  useEffect(() => {
    getOrganizations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSelected, organizationCreated]);

  const getOrganizations = useCallback(() => {
    handleResponse(
      http.get(`/organizations`),
      (response) => setOrganizations(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    organizations,
    loading,
    error,
  };
}

export { useOrganizations };
