import http from "../http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useResponsibility() {
  const [responsibility, setResponsibility] = useState([]);

  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getResponsibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResponsibility = useCallback(() => {
    handleResponse(
      http.get(`/responsibilities`),
      (response) => {
        setResponsibility(response.data);
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
    responsibility,
  };
}

export default useResponsibility;
