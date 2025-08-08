import http from "@canmingir/link/platform/http";
import { storage } from "@nucleoidjs/webstorage";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useColleagues() {
  const [colleagues, setColleagues] = useState([]);
  const { loading, error, handleResponse } = useApi();
  const [colleagueUpdated] = useEvent("COLLEAGUE_UPDATED", null);
  const [colleagueDeleted] = useEvent("COLLEAGUE_DELETED", null);
  const [colleagueAdded] = useEvent("COLLEAGUE_ADDED", null);

  const [teamSelected] = useEvent("PROJECT_SELECTED", { projectId: null });

  useEffect(() => {
    getTeamColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colleagueUpdated, colleagueDeleted, colleagueAdded, teamSelected]);

  const getTeamColleagues = useCallback(() => {
    handleResponse(
      http.get(`/colleagues`),
      (response) => setColleagues(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createColleague = useCallback(async (colleague, teamId) => {
    colleague.teamId = teamId || storage.get("projectId");

    console.log("colleague", colleague);

    const response = await http.post(`/colleagues`, {
      title: colleague.name,
      name: colleague.name,
      avatar: colleague.avatar,
      character: colleague.character,
      role: colleague.role,
      teamId: colleague.teamId,
      aiEngineId: colleague.aiEngineId,
    });

    publish("COLLEAGUE_ADDED", { colleagueId: response.data.id });

    return response.data;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteColleague = useCallback((colleagueId) => {
    handleResponse(
      http.delete(`/colleagues/${colleagueId}`),
      publish("COLLEAGUE_DELETED", { colleagueId }),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    colleagues,
    loading,
    error,
    createColleague,
    deleteColleague,
    getTeamColleagues,
  };
}

export default useColleagues;
