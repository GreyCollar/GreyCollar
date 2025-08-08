import http from "@canmingir/link/platform/http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useColleague(colleagueId) {
  const [colleague, setColleague] = useState({
    name: "",
    avatar: "",
    character: "",
    role: "",
    teamId: "",
    AIEngine: "",
  });

  const { loading, error, handleResponse } = useApi();

  // TODO - Research self-call events

  useEffect(() => {
    if (colleagueId) {
      getColleague(colleagueId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colleagueId]);

  const getColleague = useCallback((colleagueId) => {
    if (!colleagueId) {
      return;
    }

    handleResponse(
      http.get(`/colleagues/${colleagueId}`),
      (response) => setColleague(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColleague = useCallback((colleague) => {
    handleResponse(
      http.put(`/colleagues/${colleague.id}`, {
        title: colleague.title,
        name: colleague.name,
        avatar: colleague.avatar,
        character: colleague.character,
        role: colleague.role,
        projectId: colleague.projectId,
        teamId: colleague.teamId,
      }),
      () => {
        publish("COLLEAGUE_UPDATED", { colleagueId: colleague.id });
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    colleague,
    loading,
    error,
    getColleague,
    updateColleague,
  };
}

export default useColleague;
