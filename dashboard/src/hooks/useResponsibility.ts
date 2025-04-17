import http from "../http";
import useApi from "./useApi";

import { useCallback, useEffect, useState } from "react";

function useResponsibility(id?: string) {
  const [responsibility, setResponsibility] = useState([]);
  const [responsibilityNodes, setResponsibilityNodes] = useState({
    id: "",
    label: "",
    icon: "",
    Nodes: [{}],
  });

  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getResponsibility();
    if (id) {
      getResponsibilityWithNode(id);
    }
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

  const getResponsibilityWithNode = useCallback((id) => {
    handleResponse(
      http.get(`/responsibilities/${id}`),
      (response) => {
        setResponsibilityNodes(response.data);
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
    responsibilityNodes,
  };
}

export default useResponsibility;
