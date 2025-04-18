import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApiV2";

type DependencyArray = object[];

function useResponsibility() {
  const { Api } = useApi();

  const getResponsibility = (fetchState: DependencyArray = []) => {
    const { data, loading, error, fetch } = Api(
      () => http.get(`/responsibilities`),
      [...fetchState]
    );

    if (data) {
      publish("RESPONSIBILITY_LOADED", { responsibility: data });
    }

    return {
      responsibility: data,
      loading,
      error,
      fetch,
    };
  };

  const getResponsibilityWithNode = (
    id: string,
    fetchState: DependencyArray = []
  ) => {
    const { data, loading, error, fetch } = Api(
      () => http.get(`/responsibilities/${id}`),
      [...fetchState]
    );

    if (data) {
      publish("RESPONSIBILITY_NODES_LOADED", {
        responsibilityNodes: data,
      });
    }

    return {
      responsibilityNodes: data,
      loading,
      error,
      fetch,
    };
  };

  return {
    getResponsibility,
    getResponsibilityWithNode,
  };
}

export default useResponsibility;
