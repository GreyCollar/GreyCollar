import Box from "@mui/material/Box";
import ChatInput from "../../widgets/ChatInput/ChatInput";
import ResponsibilityChatContent from "./ResponsibilityChatContent";
import { createEditor } from "slate";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import React, { useMemo, useState } from "react";

function ResponsibilityChat({ setAiResponse, selectedItem, aiResponse }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    []
  );

  const addMessage = async (message, role = "user") => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, role },
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

        const response = await http.post("/colleagues/responsibility", {
          history,
          content: message,
        });

        if (response.status >= 200 && response.status < 300) {
          const aiMessage = response?.data?.response;
          if (!aiMessage) {
            throw new Error("No response received from AI");
          }

          setAiResponse(response.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: aiMessage, role: "assistant" },
          ]);
          publish("MESSAGES_LOADED", true);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
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
      <ChatInput
        onSendMessage={addMessage}
        editor={editor}
        responsibilityChat={true}
      />
    </Box>
  );
}

export default ResponsibilityChat;

const withInlines = (editor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element) =>
    ["commandText", "input", "optional"].includes(element.type) ||
    isInline(element);

  editor.isElementReadOnly = (element) =>
    element.type === "input" ||
    element.type === "commandText" ||
    element.type === "optional" ||
    isElementReadOnly(element);

  editor.isSelectable = (element) =>
    element.type !== "input" ||
    element.type !== "optional" ||
    (element.type !== "commandText" && isSelectable(element));

  editor.insertText = (text) => {
    insertText(text);
  };

  editor.insertData = (data) => {
    insertData(data);
  };

  return editor;
};

const withMentions = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;
  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };
  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };
  editor.markableVoid = (element) => {
    return element.type === "mention" || markableVoid(element);
  };
  return editor;
};
