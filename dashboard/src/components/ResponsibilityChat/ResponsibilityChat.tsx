import Box from "@mui/material/Box";
import ChatInput from "../../widgets/ChatInput/ChatInput";
import ResponsibilityChatContent from "./ResponsibilityChatContent";
import { createEditor } from "slate";
import http from "../../http";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import React, { useMemo, useState } from "react";

function ResponsibilityChat({ setAiResponse, selectedItem }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    []
  );

  const addMessage = async (message, role = "user") => {
    setMessages((prevMessages) => [...prevMessages, { text: message, role }]);

    if (role === "user") {
      setLoading(true);
      setError(null);

      try {
        const response = await http.post("/colleagues/responsibility", {
          content: message,
        });

        if (response.status >= 200 && response.status < 300) {
          const aiMessage = response?.data?.response;
          setAiResponse(response.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: aiMessage, role: "ai" },
          ]);
        } else {
          setError("Failed to fetch AI response");
        }
      } catch (err) {
        setError("Failed to fetch AI response");
      } finally {
        setLoading(false);
      }
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
        <Box sx={{ color: "error.main", my: 1, fontSize: "0.875rem" }}>
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
