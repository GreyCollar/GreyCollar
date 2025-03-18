import { mutate } from "swr";
import { useEffect } from "react";
import { useEvent } from "@nucleoidai/react-event";

export function useEvents() {
  const [knowledgeCreated] = useEvent("KNOWLEDGE_CREATED", null);
  const [knowledgeUpdated] = useEvent("KNOWLEDGE_UPDATED", null);
  const [knowledgeDeleted] = useEvent("KNOWLEDGE_DELETED", null);
  const [knowledgeStatusChanged] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);
  const [colleagueUpdated] = useEvent("COLLEAGUE_UPDATED", null);
  const [teamSelected] = useEvent("TEAM_SELECTED", null);
  const [organizationCreated] = useEvent("ORGANIZATION_CREATED", null);

  useEffect(() => {
    if (teamSelected || organizationCreated) {
      mutate((key: string) => key.startsWith("/organization"));
    }
  }, [teamSelected, organizationCreated]);

  useEffect(() => {
    if (
      knowledgeCreated ||
      knowledgeUpdated ||
      knowledgeDeleted ||
      knowledgeStatusChanged
    ) {
      mutate((key: string) => key.startsWith("/knowledge"));
    }
  }, [
    knowledgeCreated,
    knowledgeUpdated,
    knowledgeDeleted,
    knowledgeStatusChanged,
  ]);

  useEffect(() => {
    if (colleagueUpdated) {
      mutate((key: string) => key.startsWith("/colleagues"));
    }
  }, [colleagueUpdated]);
}
