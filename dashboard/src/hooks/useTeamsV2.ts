import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useSWR from "swr";

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

const fetcher = async (url: string) => {
  const response = await http.get(url);
  return response;
};

function useTeam() {
  const getTeams = () => {
    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR("/projects", fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    });

    if (data?.data) {
      publish("PROJECTS_LOADED", { projects: data.data });
    }

    return {
      teams: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const getTeamById = (teamId: string) => {
    const shouldFetch = !!teamId;

    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/projects/${teamId}` : null, fetcher);

    return {
      team: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const createTeam = () => {
    type CreateResponse = {
      success: boolean;
      message?: string;
      id?: string;
      data?: Team;
    };

    const create = async (
      team: TeamInput,
      organizationId: string
    ): Promise<CreateResponse | null> => {
      if (!team) {
        console.error("Cannot create team: Missing team input");
        return null;
      }

      try {
        const response = await http.post("/projects", {
          name: team.name,
          icon: team.avatar || team.icon,
          organizationId,
        });

        console.log("createResponse", response);

        if (response && response.data) {
          publish("PROJECT_CREATED", { project: response.data });
        }

        return response;
      } catch (error) {
        console.error("Error creating team:", error);
        return null;
      }
    };

    return {
      create,
    };
  };

  const updateTeam = () => {
    type UpdateResponse = {
      success: boolean;
      message?: string;
      id?: string;
      data?: Team;
    };

    const update = async (team: Team): Promise<UpdateResponse | null> => {
      if (!team || !team.id) {
        console.error("Cannot update team: Missing ID");
        return null;
      }

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

        return response;
      } catch (error) {
        console.error("Error updating team:", error);
        return null;
      }
    };

    return {
      update,
    };
  };

  const deleteTeam = () => {
    type DeleteResponse = {
      success: boolean;
      message?: string;
      id?: string;
    };

    const remove = async (teamId: string): Promise<DeleteResponse | null> => {
      if (!teamId) {
        console.error("Cannot delete team: Missing ID");
        return null;
      }

      try {
        const response = await http.delete(`/projects/${teamId}`);

        if (response) {
          publish("TEAM_DELETED", { teamId });
        }

        return response;
      } catch (error) {
        console.error("Error deleting team:", error);
        return null;
      }
    };

    return {
      remove,
    };
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
