import Box from "@mui/material/Box";
import InlineChatInput from "../../widgets/ChatInput/InlineChatInput";
import ResponsibilityChatContent from "./ResponsibilityChatContent";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";

import React, { useState } from "react";

function ResponsibilityChat({ setAiResponse, selectedItem, aiResponse }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const addMessage = async (message, role = "user") => {
    try {
      const parsedMessage = message
        .split(/(\{.*?\})/)
        .map((part) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            try {
              const parsed = JSON.parse(part);
              return JSON.stringify(parsed);
            } catch {
              return part;
            }
          }
          return part;
        })
        .filter((part) => part !== "")
        .join("");

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: parsedMessage, role },
      ]);

      if (role === "user") {
        setLoading(true);
        setError(null);

        const history = [
          ...messages,
          ...(aiResponse?.flow
            ? [
                {
                  content: JSON.stringify(aiResponse.flow),
                  role: "assistant",
                },
              ]
            : []),
        ];

        const { data } = await http.post("/colleagues/responsibilities", {
          history,
          content: message,
        });

        const aiMessage = data?.response;

        setAiResponse(aiMessage);

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: aiMessage, role: "assistant" },
        ]);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch AI response";
      setError(errorMessage);
      console.error("Error in addMessage:", err);
    } finally {
      setLoading(false);
      publish("MESSAGES_LOADED", true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.paper,
        paddingTop: "10px",
        paddingX: "10px",
        height: "100%",
        width: 700,
      }}
    >
      <ResponsibilityChatContent
        loading={loading}
        messages={messages}
        selectedItem={selectedItem}
      />
      {error && (
        <Box
          sx={{
            color: "error.main",
            my: 1,
            fontSize: "0.875rem",
            padding: "8px",
            backgroundColor: "error.light",
            borderRadius: "4px",
          }}
        >
          {error}
        </Box>
      )}
      <InlineChatInput onSend={(message) => addMessage(message)} />
    </Box>
  );
}

export default ResponsibilityChat;
