import http from "../http";
import { useEffect } from "react";

import { publish, useEvent } from "@nucleoidai/react-event";
import useSWR, { mutate } from "swr";

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

const fetcher = async (url: string) => {
  const response = await http.get(url);
  return response;
};

function useKnowledge() {
  const getColleagueKnowledges = (colleagueId: string) => {
    const shouldFetch = !!colleagueId;

    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR(
      shouldFetch ? `/knowledge?colleagueId=${colleagueId}` : null,
      fetcher,
      {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
      }
    );

    if (data?.data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data.data });
    }

    return {
      knowledges: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const getTeamKnowledges = (teamId: string) => {
    const shouldFetch = !!teamId;

    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/knowledge?teamId=${teamId}` : null, fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    });

    if (data?.data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data.data });
    }

    return {
      knowledges: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const getKnowledge = (knowledgeId: string) => {
    const shouldFetch = !!knowledgeId;

    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/knowledge/${knowledgeId}` : null, fetcher);

    return {
      knowledge: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
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

      try {
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
      } catch (error) {
        console.error("Error creating knowledge:", error);
        return null;
      }
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

      try {
        const response = await http.delete(`/knowledge/${knowledge.id}`);

        console.log("deleteResponse", response);

        if (response) {
          publish("KNOWLEDGE_DELETED", { knowledge: knowledge.id });
        }
      } catch (error) {
        console.error("Error deleting knowledge:", error);
        return null;
      }
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

    const changeStatus = async (
      knowledgeId: string,
      status: string
    ): Promise<StatusResponse | null> => {
      try {
        const result = await http.patch(`/knowledge/${knowledgeId}/status`, {
          status,
        });

        if (result) {
          publish("KNOWLEDGE_STATUS_CHANGED", { knowledge: result });
        }
      } catch (error) {
        console.error("Error changing knowledge status:", error);
        return null;
      }
    };

    return {
      statusResponse: null,
      loading: false,
      error: null,
      changeStatus,
    };
  };

  return {
    getTeamKnowledges,
    getKnowledge,
    getColleagueKnowledges,
    createKnowledge,
    deleteKnowledge,
    changeKnowledgeStatus,
  };
}

export default useKnowledge;
