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

  const createKnowledge = async (
    knowledge: KnowledgeInput,
    colleagueId: string
  ) => {
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

  const deleteKnowledge = async (knowledge: Knowledge) => {
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

  const changeKnowledgeStatus = async (knowledgeId: string, status: string) => {
    const result = await http.patch(`/knowledge/${knowledgeId}/status`, {
      status,
    });

    if (result.data) {
      publish("KNOWLEDGE_STATUS_CHANGED", { knowledge: result.data });
    }

    return result.data;
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
