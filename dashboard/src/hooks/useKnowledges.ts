import http from "../http";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useKnowledges(colleagueId) {
  const [knowledgeCreated] = useEvent("KNOWLEDGE_CREATED", null);
  const [knowledgeUpdated] = useEvent("KNOWLEDGE_UPDATED", null);
  const [knowledgeDeleted] = useEvent("KNOWLEDGE_DELETED", null);
  const [knowledgeStatusChanged] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);

  const [knowledges, setKnowledges] = useState([]);

  const { loading, error, handleResponse } = useApi();

  // TODO - Research self-call events

  useEffect(() => {
    if (colleagueId) {
      getColeagueKnowledge(colleagueId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    knowledgeCreated,
    knowledgeUpdated,
    knowledgeDeleted,
    knowledgeStatusChanged,
  ]);

  const createKnowledge = useCallback(
    (knowledge, colleagueId) => {
      return handleResponse(
        http.post(`/knowledge`, {
          url: knowledge.url,
          text: knowledge.text,
          question: knowledge.question,
          answer: knowledge.answer,
          colleagueId: colleagueId,
          type: knowledge.type,
        }),
        (response) => {
          publish("KNOWLEDGE_CREATED", { knowledge: response.data });
          return response.data;
        },
        (error) => {
          console.error(error);
        }
      );
    },
    [handleResponse]
  );

  const deleteKnowledges = useCallback(
    (knowledge) => {
      return handleResponse(
        http.delete(`/knowledge/${knowledge.id}`),
        (response) => {
          publish("KNOWLEDGE_DELETED", { knowledge: knowledge.id });
          return response.data;
        },
        (error) => {
          console.error(error);
        }
      );
    },
    [handleResponse]
  );

  const getColeagueKnowledge = useCallback((colleagueId) => {
    handleResponse(
      http.get(`/knowledge?colleagueId=${colleagueId}`),
      (response) => {
        setKnowledges(response.data);
        publish("KNOWLEDGE_LOADED", { knowledge: response.data });
      },
      (error) => {
        console.error(error);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    knowledges,
    loading,
    error,
    getColeagueKnowledge,
    deleteKnowledges,
    createKnowledge,
  };
}

export default useKnowledges;
