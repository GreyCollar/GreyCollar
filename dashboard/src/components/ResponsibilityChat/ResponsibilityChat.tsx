import Box from "@mui/material/Box";
import InlineChatInput from "../../widgets/ChatInput/InlineChatInput";
import React from "react";
import ResponsibilityChatContent from "./ResponsibilityChatContent";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";
import useResponsibility from "../../hooks/useResponsibility";

import { Card, CardContent, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

function ResponsibilityChat({
  setAiResponse,
  selectedItem,
  aiResponse,
  setSelectedItem,
  onTitleChange,
  onDescriptionChange,
  onCreateResponsibility,
  onMessagesChange,
}) {
  const { colleagueId } = useParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const { upsertResponsibility, getResponsibilityWithNode } =
    useResponsibility();
  const { responsibilityNodes } = getResponsibilityWithNode(selectedItem?.id);
  const theme = useTheme();

  useEffect(
    () => {
      if (onCreateResponsibility) {
        onCreateResponsibility(handleCreateResponsibility);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCreateResponsibility]
  );

  useEffect(() => {
    if (onMessagesChange) onMessagesChange(messages);
  }, [messages, onMessagesChange]);

  const handleCreateResponsibility = async (title, description) => {
    const response = await upsertResponsibility(
      selectedItem?.id,
      title,
      description,
      colleagueId
    );

    setSelectedItem(response.responsibility);
  };

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
                  content: JSON.stringify(
                    aiResponse.flow || responsibilityNodes
                  ),
                  role: "assistant",
                },
              ]
            : []),
          { content: parsedMessage, role: "user" },
        ];

        const { data } = await http.post("/colleagues/responsibilities", {
          history,
          content: message,
        });

        const { data: responsibilityNameData } = await http.post(
          "/colleagues/responsibility-name",
          {
            history: messages,
            content: message,
          }
        );

        if (onTitleChange) onTitleChange(responsibilityNameData.title);
        if (onDescriptionChange)
          onDescriptionChange(responsibilityNameData.description);

        const response = await upsertResponsibility(
          selectedItem?.id,
          responsibilityNameData.title,
          responsibilityNameData.description,
          colleagueId,
          data?.flow
        );

        setSelectedItem(response.responsibility);

        const aiMessage = data?.response;

        setAiResponse(data);

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
    <Card
      elevation={0}
      sx={{
        height: "100%",
        width: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
        },
        maxWidth: "100%",
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default}80 100%)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          p: 0,
          "&:last-child": { pb: 0 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            paddingTop: {
              xs: "8px",
              sm: "10px",
              md: "10px",
            },
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <ResponsibilityChatContent loading={loading} messages={messages} />
          {error && (
            <Box
              sx={{
                color: "error.main",
                my: 1,
                mx: 2,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.825rem",
                  md: "0.875rem",
                },
                padding: {
                  xs: "8px",
                  sm: "10px",
                  md: "12px",
                },
                backgroundColor: "error.light",
                borderRadius: 2,
                border: `1px solid ${theme.palette.error.main}20`,
              }}
            >
              {error}
            </Box>
          )}
        </Box>
        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}20`, mt: 1 }}>
          <InlineChatInput onSend={(message) => addMessage(message)} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResponsibilityChat;
