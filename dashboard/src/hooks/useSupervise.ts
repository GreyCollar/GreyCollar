import http from "@canmingir/link/platform/http";
import useApi from "./useApi";
import { useEvent } from "@nucleoidai/react-event";

import { useCallback, useEffect, useState } from "react";

function useSupervising(id) {
  const [supervising, setSupervising] = useState({
    answer: "",
    colleagueId: "",
    conversationId: "",
    sessionId: "",
    status: "",
    id: "",
    createdAt: "",
    question: "",
  });

  const [supervisingAnswered] = useEvent("SUPERVISING_ANSWERED", null);

  useEffect(() => {
    if (id) {
      getSupervisingById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisingAnswered]);

  const { loading, error, handleResponse } = useApi();

  const getSupervisingById = useCallback((id) => {
    handleResponse(
      http.get(`/supervisings/${id}`),
      (response) => {
        setSupervising(response.data);
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
    supervising,
  };
}

export default useSupervising;
