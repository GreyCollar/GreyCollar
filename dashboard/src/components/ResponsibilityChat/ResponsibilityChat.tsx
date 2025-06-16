import Box from "@mui/material/Box";
import InlineChatInput from "../../widgets/ChatInput/InlineChatInput";
import ResponsibilityChatContent from "./ResponsibilityChatContent";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";
import useResponsibility from "../../hooks/useResponsibility";
import { useState } from "react";

function ResponsibilityChat({
  setAiResponse,
  selectedItem,
  aiResponse,
  setSelectedItem,
}) {
  const { colleagueId } = useParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(selectedItem?.title);
  const [description, setDescription] = useState(selectedItem?.description);
  const { upsertResponsibility, getResponsibilityWithNode } =
    useResponsibility();
  const { responsibilityNodes } = getResponsibilityWithNode(selectedItem?.id);

  const handleCreateResponsibility = async (title, description) => {
    const response = await upsertResponsibility(
      selectedItem?.id,
      title,
      description,
      colleagueId
    );

    setSelectedItem(response.responsibility);

    if (response.responsibility) {
      setTitle(response.responsibility.title);
      setDescription(response.responsibility.description);
    }
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

        setTitle(responsibilityNameData.title);
        setDescription(responsibilityNameData.description);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.paper,
        paddingTop: {
          xs: "8px",
          sm: "10px",
          md: "10px",
        },
        height: "100%",
        width: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: 820,
          xl: 820,
        },
        maxWidth: "100%",
        padding: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },
      }}
    >
      <ResponsibilityChatContent
        loading={loading}
        messages={messages}
        title={title}
        description={description}
        setTitle={setTitle}
        handleCreateResponsibility={handleCreateResponsibility}
      />
      {error && (
        <Box
          sx={{
            color: "error.main",
            my: 1,
            fontSize: {
              xs: "0.75rem",
              sm: "0.825rem",
              md: "0.875rem",
            },
            padding: {
              xs: "6px",
              sm: "7px",
              md: "8px",
            },
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
