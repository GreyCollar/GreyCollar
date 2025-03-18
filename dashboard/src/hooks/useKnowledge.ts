import http from "../http";

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

// Define fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await http.get(url);
  return response;
};

function useKnowledge() {
  const [knowledgeCreated] = useEvent("KNOWLEDGE_CREATED", null);
  const [knowledgeUpdated] = useEvent("KNOWLEDGE_UPDATED", null);
  const [knowledgeDeleted] = useEvent("KNOWLEDGE_DELETED", null);
  const [knowledgeStatusChanged] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);

  const getColleagueKnowledges = (
    colleagueId: string,
    fetchState: unknown[] = []
  ) => {
    // Only fetch if colleagueId exists
    const shouldFetch = !!colleagueId;

    const {
      data,
      error,
      isValidating,
      mutate: refetch,
    } = useSWR(
      shouldFetch ? `/knowledge?colleagueId=${colleagueId}` : null,
      fetcher,
      {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0, // Disable polling
      }
    );

    // Trigger revalidation when knowledge-related events occur
    if (
      knowledgeCreated ||
      knowledgeUpdated ||
      knowledgeDeleted ||
      knowledgeStatusChanged
    ) {
      refetch();
    }

    // Publish event when knowledges are loaded
    if (data?.data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data.data });
    }

    console.log("data", data);

    return {
      knowledges: data?.data,
      loading: !error && !data && shouldFetch,
      error,
      fetch: refetch,
    };
  };

  const getTeamKnowledges = (teamId: string, fetchState: unknown[] = []) => {
    // Only fetch if teamId exists
    const shouldFetch = !!teamId;

    const {
      data,
      error,
      isValidating,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/knowledge?teamId=${teamId}` : null, fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Disable polling
    });

    // Trigger revalidation when knowledge-related events occur
    if (
      knowledgeCreated ||
      knowledgeUpdated ||
      knowledgeDeleted ||
      knowledgeStatusChanged
    ) {
      refetch();
    }

    // Publish event when knowledges are loaded
    if (data?.data) {
      publish("KNOWLEDGE_LOADED", { knowledge: data.data });
    }

    return {
      knowledges: data?.data,
      loading: !error && !data && shouldFetch,
      error,
      fetch: refetch,
    };
  };

  const getKnowledge = (knowledgeId: string) => {
    const shouldFetch = !!knowledgeId;

    const {
      data,
      error,
      isValidating,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/knowledge/${knowledgeId}` : null, fetcher);

    return {
      knowledge: data?.data,
      loading: !error && !data && shouldFetch,
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
          // Update the SWR cache for colleague knowledges
          mutate(`/knowledge?colleagueId=${colleagueId}`);
          // If team ID is available in the response, update team knowledges cache too
          if (response.data.teamId) {
            mutate(`/knowledge?teamId=${response.data.teamId}`);
          }

          publish("KNOWLEDGE_CREATED", { knowledge: response.data });
        }

        return response.data;
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
          // Update relevant SWR caches
          mutate(`/knowledge?colleagueId=${knowledge.colleagueId}`);
          if (knowledge.teamId) {
            mutate(`/knowledge?teamId=${knowledge.teamId}`);
          }

          publish("KNOWLEDGE_DELETED", { knowledge: knowledge.id });
        }

        return response.data;
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
          // Fetch the full knowledge object to get colleague and team IDs
          const knowledgeDetails = await http.get(`/knowledge/${knowledgeId}`);

          if (knowledgeDetails) {
            // Update relevant SWR caches
            mutate(`/knowledge?colleagueId=${knowledgeDetails.colleagueId}`);
            if (knowledgeDetails.teamId) {
              mutate(`/knowledge?teamId=${knowledgeDetails.teamId}`);
            }
            // Also update the single knowledge cache
            mutate(`/knowledge/${knowledgeId}`);
          }

          publish("KNOWLEDGE_STATUS_CHANGED", { knowledge: result });
        }

        return result;
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
