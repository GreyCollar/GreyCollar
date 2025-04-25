import { convertToNodesAndEdges } from "../components/ResponsibilityFlow/flowAdapter";
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
    let result;

    if (data) {
      console.log("Responsibility data:", data);
      result = convertToNodesAndEdges(data.Nodes);

      publish("RESPONSIBILITY_NODES_LOADED", {
        responsibilityNodes: result,
      });
    }

    return {
      responsibilityNodes: result,
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
