import { convertToNodesAndEdges } from "../components/ResponsibilityFlow/flowAdapter";
import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApiV2";
import { v4 as uuidv4 } from "uuid";

type DependencyArray = object[];

type NodeType = {
  id: string;
  properties?: {
    label: string;
    icon: string;
  };
  type: string;
  responsibilityId?: string;
  dependencyId?: string | null;
};

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
      () => (id ? http.get(`/responsibilities/${id}`) : null),
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

  const createResponsibility = async (
    title: string,
    description: string,
    colleagueId: string
  ) => {
    const response = await http.post("/responsibilities", {
      title,
      description,
      colleagueId,
    });
    if (response?.data) {
      publish("RESPONSIBILITY_CREATED", { responsibility: response.data });
    }
    return { responsibility: response?.data };
  };

  const upsertResponsibility = async (
    responsibilityId: string,
    title: string,
    description: string,
    colleagueId: string,
    nodes?: NodeType[]
  ) => {
    if (!responsibilityId) {
      responsibilityId = uuidv4();
    }

    const response = await http.put(`/responsibilities/${responsibilityId}`, {
      title,
      description,
      nodes,
      colleagueId,
    });
    if (response?.data) {
      publish("RESPONSIBILITY_UPSERTED", { responsibility: response.data });
    }
    return { responsibility: response?.data };
  };

  const removeResponsibility = async (
    responsibilityId: string,
    colleagueId: string
  ) => {
    const response = await http.delete(
      `/responsibilities/${responsibilityId}`,
      {
        data: {
          colleagueId,
        },
      }
    );
    if (response?.data) {
      publish("RESPONSIBILITY_REMOVED", { responsibility: response.data });
    }
    return { responsibility: response?.data };
  };

  return {
    getResponsibility,
    getResponsibilityWithNode,
    createResponsibility,
    upsertResponsibility,
    removeResponsibility,
  };
}

export default useResponsibility;
