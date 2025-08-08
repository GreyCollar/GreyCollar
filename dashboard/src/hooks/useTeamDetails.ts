import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useTeamDetails() {
  const [teamDetails, setTeamDetails] = useState({
    id: "",
    coach: "",
    coachAvatar: "",
  });

  useEffect(() => {
    getTeamDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error, handleResponse } = useApi();

  const getTeamDetails = useCallback(() => {
    handleResponse(
      http.get("/teams/details"),
      (response) => setTeamDetails(response.data),
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teamDetails,
    loading,
    error,
  };
}

export default useTeamDetails;
