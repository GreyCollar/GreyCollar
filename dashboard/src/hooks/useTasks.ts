import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useTasks(colleagueId) {
  const [tasks, setTasks] = useState([
    {
      description: "",
      colleagueId: "",
      status: "",
      commandId: "",
      id: "",
      createdAt: "",
    },
  ]);

  const [steps, setSteps] = useState([
    {
      description: "",
      id: "",
      type: "",
      createdAt: "",
      referenceId: "",
    },
  ]);

  const { loading, error, handleResponse } = useApi();

  const [taskStatus] = useEvent("TASK_STATUS_CHANGED", null);
  const [taskCreated] = useEvent("TASK_CREATED", null);
  const [taskStepLoading] = useEvent("TASK_STEP_LOADED", null);

  useEffect(() => {
    getTasks(colleagueId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStatus, taskCreated, taskStepLoading]);

  const createTask = useCallback((task, colleagueId) => {
    handleResponse(
      http.post(`/tasks`, {
        description: task,
        colleagueId: colleagueId,
      }),
      (response) => {
        publish("TASK_CREATED", response.data);
        return response.data;
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTasks = useCallback((colleagueId) => {
    handleResponse(
      http.get(`/tasks?colleagueId=${colleagueId}`),
      (response) => {
        setTasks(response.data);
        publish("TASK_LOADED", response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSteps = useCallback((id) => {
    handleResponse(
      http.get(`/tasks/${id}/steps`),
      (response) => {
        setSteps(response.data);
        publish("TASK_STEP_LOADED", response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTaskSupervising = useCallback((id, text, addToKnowledgeBase) => {
    handleResponse(
      http.post(`/tasks/${id}/supervising`, {
        colleagueId,
        text,
        addToKnowledgeBase,
      }),
      (response) => {
        return response.data;
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
    tasks,
    getSteps,
    steps,
    createTask,
    createTaskSupervising,
  };
}

export default useTasks;
