import http from "@canmingir/link/platform/http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";

import { useCallback, useState } from "react";

function useTeams() {
  const [teams, setTeams] = useState([{ id: "", name: "", icon: "" }]);
  const { loading, error, handleResponse } = useApi();

  const getTeams = useCallback(() => {
    handleResponse(
      http.get("/teams"),
      (response) => setTeams(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTeam = useCallback(async (team, organizationId) => {
    const response = await http.post(`/projects`, {
      name: team.name,
      icon: team.avatar,
      organizationId,
    });

    publish("PROJECT_CREATED", { project: response.data });

    return response.data;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTeam = useCallback((teamId) => {
    handleResponse(
      http.delete(`/projects/${teamId}`),
      (error) => {
        console.error(error);
      },
      publish("TEAM_DELETED", { teamId })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teams,
    loading,
    error,
    createTeam,
    getTeams,
    deleteTeam,
  };
}

export default useTeams;
