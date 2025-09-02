import http from "@canmingir/link/platform/http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useAIEngines() {
  const [engines, setEngines] = useState([
    {
      id: "",
      vendor: "",
      model: "",
      avatar: "",
      createdAt: "",
      description: "",
      price: "",
    },
  ]);

  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getEngines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEngines = useCallback(() => {
    handleResponse(
      http.get(`/engines`),
      (response) => {
        setEngines(response.data);
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
    engines,
  };
}

export default useAIEngines;
