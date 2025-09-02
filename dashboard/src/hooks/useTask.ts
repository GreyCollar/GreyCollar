import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useTask(id) {
  const [task, setTask] = useState({
    description: "",
    colleagueId: "",
    status: "",
    commandId: "",
    id: "",
    createdAt: "",
  });

  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getTask(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTask = useCallback((id) => {
    handleResponse(
      http.get(`/tasks/${id}`),
      (response) => {
        setTask(response.data);
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
    task,
  };
}

export default useTask;
