import http from "../http";
import useApi from "./useApiV2";

import { publish, useEvent } from "@nucleoidai/react-event";

export type Knowledge = {
  id: string;
  type: string;
  text: string;
  url: string;
  question: string;
  answer: string;
  colleagueId: string;
  status: string;
  createdAt: string;
  teamId: string;
};

export type KnowledgeInput = {
  type: string;
  text?: string;
  url?: string;
  question?: string;
  answer?: string;
};

type DependencyArray = object[];

function useKnowledge() {
  const { Api } = useApi();

  const [knowledgeCreated] = useEvent("KNOWLEDGE_CREATED", null);
  const [knowledgeUpdated] = useEvent("KNOWLEDGE_UPDATED", null);
  const [knowledgeDeleted] = useEvent("KNOWLEDGE_DELETED", null);
  const [knowledgeStatusChanged] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);

  const getKnowledge = (
    knowledgeId: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [
      knowledgeUpdated,
      knowledgeStatusChanged,
      knowledgeDeleted,
    ];

    const { data, loading, error, fetch } = Api(
      () => http.get(`/knowledge/${knowledgeId}`),
      [knowledgeId, ...eventDependencies, ...fetchState]
    );

    return {
      knowledge: data,
      loading,
      error,
      fetch,
    };
  };

  const getTeamKnowledges = (
    teamId: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [
      knowledgeCreated,
      knowledgeUpdated,
      knowledgeDeleted,
      knowledgeStatusChanged,
    ];

    const { data, loading, error, fetch } = Api(
      () => (teamId ? http.get(`/knowledge?teamId=${teamId}`) : null),
      [teamId, ...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data });
    }

    return {
      knowledges: data,
      loading,
      error,
      fetch,
    };
  };

  const getColleagueKnowledges = (
    colleagueId: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [
      knowledgeCreated,
      knowledgeUpdated,
      knowledgeDeleted,
      knowledgeStatusChanged,
    ];

    const { data, loading, error, fetch } = Api(
      () =>
        colleagueId ? http.get(`/knowledge?colleagueId=${colleagueId}`) : null,
      [colleagueId, ...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data });
    }

    return {
      knowledges: data,
      loading,
      error,
      fetch,
    };
  };

  const createKnowledge = () => {
    type CreateResponse = {
      success: boolean;
      message?: string;
      id?: string;
      data?: Knowledge;
    };

    const create = async (
      knowledge: KnowledgeInput,
      colleagueId: string
    ): Promise<CreateResponse | null> => {
      if (!knowledge) {
        console.error("Cannot create knowledge: Missing knowledge input");
        return null;
      }

      const response = await http.post("/knowledge", {
        url: knowledge.url,
        text: knowledge.text,
        question: knowledge.question,
        answer: knowledge.answer,
        colleagueId: colleagueId,
        type: knowledge.type,
      });

      console.log("createResponse", response);

      if (response && response.data) {
        publish("KNOWLEDGE_CREATED", { knowledge: response.data });
      }

      return response.data;
    };

    return {
      create,
    };
  };

  const deleteKnowledge = () => {
    type DeleteResponse = {
      success: boolean;
      message?: string;
      id?: string;
    };

    const remove = async (
      knowledge: Knowledge
    ): Promise<DeleteResponse | null> => {
      if (!knowledge || !knowledge.id) {
        console.error("Cannot delete knowledge: Missing ID");
        return null;
      }

      const response = await http.delete(`/knowledge/${knowledge.id}`);

      console.log("deleteResponse", response);

      if (response) {
        publish("KNOWLEDGE_DELETED", { knowledge: knowledge.id });
      }

      return response.data;
    };

    return {
      remove,
    };
  };

  const changeKnowledgeStatus = () => {
    type StatusResponse = {
      id: string;
      status: string;
      success: boolean;
    };

    const {
      data: statusResponse,
      loading,
      error,
      fetch,
    } = Api((knowledgeId: string, status: string) =>
      http.patch(`/knowledge/${knowledgeId}/status`, { status })
    );

    const changeStatus = async (
      knowledgeId: string,
      status: string
    ): Promise<StatusResponse | null> => {
      const result = await fetch(knowledgeId, status);
      if (result) {
        publish("KNOWLEDGE_STATUS_CHANGED", { knowledge: result });
      }
      return result;
    };

    return {
      statusResponse,
      loading,
      error,
      changeStatus,
    };
  };

  return {
    getKnowledge,
    getTeamKnowledges,
    getColleagueKnowledges,
    createKnowledge,
    deleteKnowledge,
    changeKnowledgeStatus,
  };
}

export default useKnowledge;
