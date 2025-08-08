import http from "@canmingir/link/platform/http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";
import { useCallback } from "react";

function useChat() {
  const { loading, error, handleResponse } = useApi();

  const createMessage = useCallback((message) => {
    return handleResponse(
      http.post(`/messages`, {
        role: message.role,
        userId: message.userId,
        content: message.content,
        status: message.status,
        replyTo: message.replyTo,
      }),
      (response) => {
        publish("MESSAGE_CREATED", { message: response.data });
        return response.data;
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMessageStatus = useCallback((date) => {
    handleResponse(
      http.patch(`/messages?offset=${date}`, {
        status: "READ",
      }),
      (response) => {
        publish("MESSAGE_STATUS_UPDATED", { message: response.data });
        return response.data;
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessagesByDate = useCallback(
    async (date) => {
      const response = await handleResponse(
        http.get(`/messages?offset=${date}`),
        (response) => {
          const messages = response.data;
          publish("MESSAGES_LOADED_BY_DATE", { messages });
          return messages;
        },
        (error) => {
          console.error(error);
        }
      );
      return response;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    loading,
    error,
    createMessage,
    updateMessageStatus,
    getMessagesByDate,
  };
}

export default useChat;
