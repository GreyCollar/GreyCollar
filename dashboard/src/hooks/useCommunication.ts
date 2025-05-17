import http from "../http";
import useApi from "./useApiV2";

import { publish, useEvent } from "@nucleoidai/react-event";

export type CommunicationPayload = {
  channelType: string;
  channelCode: string;
  responsibilityId: string;
};

function useCommunication() {
  const { Api } = useApi();

  const [communicationCreated] = useEvent("COMMUNICATION_CREATED", null);
  const [communicationDeleted] = useEvent("COMMUNICATION_DELETED", null);

  const getCommunications = () => {
    const eventDependencies = [communicationCreated, communicationDeleted];

    const { data, loading, error, fetch } = Api(
      () => http.get("/communications"),
      [...eventDependencies]
    );

    if (data) {
      publish("COMMUNICATIONS_LOADED", { communications: data });
    }

    return {
      communications: data,
      loading,
      error,
      fetch,
    };
  };

  const createCommunication = async (communication: CommunicationPayload) => {
    const response = await http.post("/communications", communication);
    publish("COMMUNICATION_CREATED", { communication: response.data });
    return response.data;
  };

  const deleteCommunication = async (id: string) => {
    await http.delete(`/communications/${id}`);
    publish("COMMUNICATION_DELETED", { id });
  };

  return { getCommunications, createCommunication, deleteCommunication };
}

export default useCommunication;
