import http from "@canmingir/link/platform/http";
import useApi from "./useApiV2";
import { useCallback } from "react";

import { publish, useEvent } from "@nucleoidai/react-event";

type SupervisingInput = {
  conversationId: string;
  colleagueId: string;
  sessionId: string;
};

function useSupervisings() {
  const { Api } = useApi();

  const [supervisingAnswered] = useEvent("SUPERVISING_ANSWERED", null);

  const createSupervising = async (supervising: SupervisingInput) => {
    if (!supervising) {
      console.error("Cannot create supervising: Missing supervising input");
      return null;
    }

    const response = await http.post(`/supervisings`, {
      conversationId: supervising.conversationId,
      colleagueId: supervising.colleagueId,
      sessionId: supervising.sessionId,
    });

    return response?.data;
  };

  // Refactored: directly return the update function
  const updateSupervising = async (
    supervisingId: string,
    inputValue: string
  ) => {
    const response = await http.patch(`/supervisings/${supervisingId}`, {
      status: "ANSWERED",
      answer: inputValue,
    });

    if (response?.data) {
      publish("SUPERVISING_ANSWERED", response.data);
    }

    return response?.data;
  };

  const getColleagueSupervising = useCallback((colleagueId?: string) => {
    if (!colleagueId) return;

    const { data, loading, error } = Api(
      () => http.get(`/colleagues/${colleagueId}/supervisings`),
      [colleagueId, supervisingAnswered]
    );

    return {
      supervisings: data,
      loading,
      error,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColleagueSupervisingByStatus = useCallback(
    (colleagueId?: string, status?: string) => {
      if (!colleagueId) return;

      const endpoint =
        !status || status === "All"
          ? `/colleagues/${colleagueId}/supervisings`
          : `/colleagues/${colleagueId}/supervisings?status=${status}`;

      const { data, loading, error, fetch } = Api(
        () => http.get(endpoint),
        [colleagueId, status, supervisingAnswered]
      );

      return {
        supervisings: data,
        loading,
        error,
        fetch,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    createSupervising,
    updateSupervising,
    getColleagueSupervisingByStatus,
    getColleagueSupervising,
  };
}

export default useSupervisings;
