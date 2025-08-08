import http from "@canmingir/link/platform/http";
import useApi from "./useApi";
import { useLocation } from "react-router-dom";
import useMessage from "./useMessage";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useRef, useState } from "react";

function useChat() {
  const [messages, setMessages] = useState<
    Array<{
      role: string;
      content: string;
      colleagueId: string;
      createdAt: string;
      userId: string;
      command: string;
      knowledgeId: string;
      status?: string;
      id: string;
    }>
  >([]);

  const location = useLocation();

  const onChatPage = location.pathname === "/chat";

  const { getMessagesByDate, updateMessageStatus } = useMessage();

  const { loading, error, handleResponse } = useApi();

  const [messageCreated] = useEvent("MESSAGE_CREATED", null);
  const [supervisingAnswered] = useEvent("SUPERVISING_ANSWERED", null);
  const [taskStatus] = useEvent("TASK_STATUS_CHANGED", null);
  const [taskCreated] = useEvent("TASK_CREATED", null);
  const [knowledgeStatusChanged] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);
  // TODO - Research self-call events

  useEffect(() => {
    getMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messageCreated,
    supervisingAnswered,
    taskStatus,
    taskCreated,
    knowledgeStatusChanged,
  ]);

  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchMessages = async () => {
      if (messages.length > 0) {
        let lastMessageDate = null;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].status === "READ") {
            lastMessageDate = messages[i].createdAt;
            break;
          }
        }

        const newMessages = await getMessagesByDate(lastMessageDate);
        console.log("newMessages", newMessages);
        const filteredMessages = newMessages.filter(
          (newMessage) =>
            !Array.isArray(messages) ||
            !messages.some((message) => message.id === newMessage.id)
        );

        if (filteredMessages.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...filteredMessages]);
          publish("MESSAGE_LOADED", { message: filteredMessages });
        }
        if (onChatPage && !document.hidden) {
          updateMessageStatus(lastMessageDate);
          const updatedStatus = newMessages.filter(
            (message) => message.status === "READ"
          );
          if (updatedStatus.length > 0) {
            setMessages((prevMessages) =>
              prevMessages.map((message) => {
                const updatedMessage = updatedStatus.find(
                  (newMessage) => newMessage.id === message.id
                );
                return updatedMessage
                  ? { ...message, status: "READ" }
                  : message;
              })
            );
            publish("MESSAGE_STATUS_UPDATED", { message: updatedStatus });
          }
        }
      }
    };

    intervalId.current = setInterval(fetchMessages, 2000);

    return () => clearInterval(intervalId.current);
  });

  const getMessages = useCallback(() => {
    handleResponse(
      http.get(`/messages`),
      (response) => {
        const sortedMessages = response.data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
        publish("MESSAGES_LOADED", { messages: sortedMessages }),
          (error) => {
            console.error(error);
          };
      },
      (error) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messages,
    loading,
    error,
  };
}

export default useChat;
