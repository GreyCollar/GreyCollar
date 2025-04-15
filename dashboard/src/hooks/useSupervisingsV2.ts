import http from "../http";
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

  const createSupervising = () => {
    const { loading, error, fetch } = Api((supervising: SupervisingInput) =>
      http.post(`/supervisings`, {
        conversationId: supervising.conversationId,
        colleagueId: supervising.colleagueId,
        sessionId: supervising.sessionId,
      })
    );

    const create = async (supervising: SupervisingInput) => {
      if (!supervising) {
        console.error("Cannot create supervising: Missing supervising input");
        return null;
      }

      const result = await fetch(supervising);
      return result?.data;
    };

    return {
      create,
      loading,
      error,
    };
  };

  const updateSupervising = () => {
    const { loading, error, fetch } = Api(
      (params: { supervisingId: string; inputValue: string }) =>
        http.patch(`/supervisings/${params.supervisingId}`, {
          status: "ANSWERED",
          answer: params.inputValue,
        })
    );

    const update = async (supervisingId: string, inputValue: string) => {
      if (!supervisingId) {
        console.error("Cannot update supervising: Missing supervisingId");
        return null;
      }

      const result = await fetch({ supervisingId, inputValue });

      if (result?.data) {
        publish("SUPERVISING_ANSWERED", result.data);
      }

      return result?.data;
    };

    return {
      update,
      loading,
      error,
    };
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
    createSupervising: createSupervising(),
    updateSupervising: updateSupervising(),
    getColleagueSupervisingByStatus,
    getColleagueSupervising,
  };
}

export default useSupervisings;
