import http from "@canmingir/link/platform/http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useTeam(teamId) {
  const [team, setTeam] = useState({ id: "", name: "", icon: "" });
  const [teamById, setTeamById] = useState({
    id: "",
    name: "",
    icon: "",
    organizationId: "",
  });
  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (teamId) {
      getTeamById(teamId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const getTeam = useCallback(() => {
    handleResponse(
      http.get(`/projects`),
      (response) => setTeam(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTeamById = useCallback((teamId) => {
    if (!teamId) {
      return;
    }
    handleResponse(
      http.get(`/projects/${teamId}`),
      (response) => {
        setTeamById(response.data);
        publish("TEAM_SELECTED", { teamId: teamId });
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTeam = useCallback((team) => {
    handleResponse(
      http.put(`/projects/${team.id}`, {
        name: team.name,
        icon: team.icon,
        coach: "John Doe",
        companyId: "4def7431-cb19-4aab-aa4b-2a84198cb56a",
      }),

      publish("TEAM_UPDATED", { teamId: team.id }),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    team,
    loading,
    error,
    getTeam,
    updateTeam,
    teamById,
  };
}

export default useTeam;
