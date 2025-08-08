import http from "@canmingir/link/platform/http";
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

type DependencyArray = object[];

function useColleague() {
  const { Api } = useApi();

  const [colleagueUpdated] = useEvent("COLLEAGUE_UPDATED", null);

  const getColleague = (
    colleagueId: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [colleagueUpdated];

    const { data, loading, error, fetch } = Api(
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

    const { data, loading, error, fetch } = Api(
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

  const updateColleague = async (colleague: Colleague) => {
    const response = await http.put(`/colleagues/${colleague.id}`, {
      title: colleague.title,
      name: colleague.name,
      avatar: colleague.avatar,
      character: colleague.character,
      role: colleague.role,
      projectId: colleague.projectId,
      teamId: colleague.teamId,
    });

    if (response && response.data) {
      publish("COLLEAGUE_UPDATED", { colleagueId: colleague.id });
    }

    return response.data;
  };

  return {
    getColleagues,
    getColleague,
    updateColleague,
  };
}

export default useColleague;
