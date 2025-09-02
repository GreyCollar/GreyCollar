import config from "../../config";
import http from "@canmingir/link/platform/http";
import { io } from "socket.io-client";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

import { useCallback, useEffect, useRef, useState } from "react";

function useSession(colleagueId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const { host, path } = config.socket;

  const token = storage.get(config.name, "accessToken");

  useEffect(
    () => {
      socketRef.current = io(host, {
        path,
        auth: { token },
        query: { colleagueId },
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("ai_message", ({ content }) => {
        setConversations((prev) => [...prev, { role: "AI", content }]);
        publish("AI_RESPONDED", { content });
      });

      return () => {
        socket.off("connect");
        socket.off("ai_message");
        socket.disconnect();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sendMessage = useCallback((content) => {
    setLoading(true);
    socketRef.current.emit("customer_message", { content }, (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        publish("CONVERSATION_SENT", response.data);
        setConversations((prev) => [...prev, { role: "USER", content }]);
      }
      setLoading(false);
    });
  }, []);

  const getSession = useCallback(async (id) => {
    if (id) {
      http.get(`/sessions/${id}`).then((response) => {
        setConversations(response.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getSession,
    loading,
    error,
    conversations,
    sendMessage,
  };
}

export default useSession;
