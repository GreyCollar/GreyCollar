import http from "../http";
import useApi from "./useApi";
import { useEvent } from "@nucleoidai/react-event";

import { useCallback, useEffect, useState } from "react";

function useStatistics() {
  const [statistics, setStatisticks] = useState({
    responseRate: "",
    knowledgeSize: "",
    taskCount: "",
    totalMessages: "",
    id: "",
    supervisingRate: "",
  });

  const { loading, error, handleResponse } = useApi();

  const [teamSelected] = useEvent("PROJECT_SELECTED", null);

  useEffect(() => {
    getStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSelected]);

  const getStatistics = useCallback(() => {
    handleResponse(
      http.get(`/statistics`),
      (response) => {
        setStatisticks(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    statistics,
  };
}

export default useStatistics;
