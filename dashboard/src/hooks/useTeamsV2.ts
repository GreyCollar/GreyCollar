import http from "@canmingir/link/platform/http";
import useApi from "./useApiV2";

import { publish, useEvent } from "@nucleoidai/react-event";

export type Team = {
  id: string;
  name: string;
  icon: string;
  organizationId?: string;
};

export type TeamInput = {
  name: string;
  icon?: string;
  avatar?: string;
};

type DependencyArray = object[];

function useTeam() {
  const { Api } = useApi();

  const [teamCreated] = useEvent("PROJECT_CREATED", null);
  const [teamUpdated] = useEvent("TEAM_UPDATED", null);
  const [teamDeleted] = useEvent("TEAM_DELETED", null);

  const getTeams = (fetchState: DependencyArray = []) => {
    const eventDependencies = [teamCreated, teamUpdated, teamDeleted];

    const { data, loading, error, fetch } = Api(
      () => http.get("/projects"),
      [...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("PROJECTS_LOADED", { projects: data });
    }

    return {
      teams: data,
      loading,
      error,
      fetch,
    };
  };

  const getTeamById = (teamId: string, fetchState: DependencyArray = []) => {
    const eventDependencies = [teamUpdated, teamDeleted];

    const { data, loading, error, fetch } = Api(
      () => (teamId ? http.get(`/projects/${teamId}`) : null),
      [teamId, ...eventDependencies, ...fetchState]
    );

    return {
      team: data,
      loading,
      error,
      fetch,
    };
  };

  const createTeam = async (team: TeamInput, organizationId: string) => {
    try {
      const response = await http.post("/projects", {
        name: team.name,
        icon: team.avatar || team.icon,
        organizationId,
      });

      if (response && response.data) {
        publish("PROJECT_CREATED", { project: response.data });
      }

      return response?.data;
    } catch (error) {
      console.error("Error creating team:", error);
      return null;
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      const response = await http.put(`/projects/${team.id}`, {
        name: team.name,
        icon: team.icon,
        organizationId: team.organizationId,
      });

      console.log("updateResponse", response);

      if (response) {
        publish("TEAM_UPDATED", { teamId: team.id });
      }

      return response?.data;
    } catch (error) {
      console.error("Error updating team:", error);
      return null;
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const response = await http.delete(`/projects/${teamId}`);

      if (response) {
        publish("TEAM_DELETED", { teamId });
      }

      return response?.data;
    } catch (error) {
      console.error("Error deleting team:", error);
      return null;
    }
  };

  return {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
  };
}

export default useTeam;
