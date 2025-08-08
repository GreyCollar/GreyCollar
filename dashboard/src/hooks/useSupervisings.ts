import http from "@canmingir/link/platform/http";
import useApi from "./useApi";
import { useSocket } from "./useSocket";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useSupervisings(colleagueId?: string) {
  const socket = useSocket();

  const [supervisings, setSupervisings] = useState([
    {
      answer: "",
      colleagueId: "",
      conversationId: "",
      sessionId: "",
      status: "",
      id: "",
    },
  ]);

  const [supervisingAnswered] = useEvent("SUPERVISING_ANSWERED", null);

  useEffect(() => {
    if (!socket) return;

    socket.on("supervising_created", (supervising) => {
      console.log(supervising, "SUPERVISING CREATED");
      if (supervising.colleagueId === colleagueId)
        getColleagueSupervising(colleagueId);
    });

    return () => {
      socket.off("supervising_created");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (colleagueId) {
      getColleagueSupervising(colleagueId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisingAnswered, colleagueId]);

  const { loading, error, handleResponse } = useApi();

  const createSupervising = useCallback((supervising) => {
    handleResponse(
      http.post(`/supervisings`, {
        conversationId: supervising.conversationId,
        colleagueId: supervising.colleagueId,
        sessionId: supervising.sessionId,
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

  const updateSupervising = useCallback((supervisingId, inputValue) => {
    handleResponse(
      http.patch(`/supervisings/${supervisingId}`, {
        status: "ANSWERED",
        answer: inputValue,
      }),
      (response) => {
        publish("SUPERVISING_ANSWERED", response.data);
        return response.data;
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColleagueSupervising = useCallback((colleagueId) => {
    handleResponse(
      http.get(`/colleagues/${colleagueId}/supervisings`),
      (response) => {
        setSupervisings(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColleagueSupervisingByStatus = useCallback((colleagueId, status) => {
    const endpoint =
      status === "All"
        ? `/colleagues/${colleagueId}/supervisings`
        : `/colleagues/${colleagueId}/supervisings?status=${status}`;

    return handleResponse(
      http.get(endpoint),
      (response) => {
        setSupervisings(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    createSupervising,
    updateSupervising,
    loading,
    error,
    supervisings,
    getColleagueSupervisingByStatus,
  };
}

export default useSupervisings;
