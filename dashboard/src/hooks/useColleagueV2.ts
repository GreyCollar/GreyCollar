import http from "../http";
import useApi from "./useApiV2";

import { publish, useEvent } from "@nucleoidai/react-event";

export type Colleague = {
  id: string;
  name: string;
  avatar: string;
  character: string;
  role: string;
  teamId: string;
  AIEngine: string;
  title?: string;
  projectId?: string;
};

type DependencyArray = unknown[];

function useColleague() {
  const { CreateOperation } = useApi();

  const [colleagueUpdated] = useEvent("COLLEAGUE_UPDATED", null);

  const getColleague = (
    colleagueId: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [colleagueUpdated];

    const { data, loading, error, fetch } = CreateOperation(
      () => (colleagueId ? http.get(`/colleagues/${colleagueId}`) : null),
      [colleagueId, ...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("COLLEAGUE_LOADED", { data });
    }

    return {
      colleague: data,
      loading,
      error,
      fetch,
    };
  };

  const getColleagues = (fetchState: DependencyArray = []) => {
    const eventDependencies = [colleagueUpdated];

    const { data, loading, error, fetch } = CreateOperation(
      () => http.get("/colleagues"),
      [...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("COLLEAGUES_LOADED", { colleagues: data });
    }

    return {
      colleagues: data,
      loading,
      error,
      fetch,
    };
  };

  const updateColleague = (colleague: Colleague) => {
    type UpdateResponse = {
      success: boolean;
      message?: string;
      data?: Colleague;
    };

    const {
      data: updateResponse,
      loading,
      error,
      fetch,
    } = CreateOperation(() =>
      http.put(`/colleagues/${colleague.id}`, {
        title: colleague.title,
        name: colleague.name,
        avatar: colleague.avatar,
        character: colleague.character,
        role: colleague.role,
        projectId: colleague.projectId,
        teamId: colleague.teamId,
      })
    );

    const update = async (
      colleague: Colleague
    ): Promise<UpdateResponse | null> => {
      if (!colleague || !colleague.id) {
        console.error("Cannot update colleague: Missing ID");
        return null;
      }

      const result = await fetch(colleague);

      if (result) {
        publish("COLLEAGUE_UPDATED", { colleagueId: colleague.id });
      }

      return result;
    };

    return {
      updateResponse,
      loading,
      error,
      update,
    };
  };

  return {
    getColleagues,
    getColleague,
    updateColleague,
  };
}

export default useColleague;
