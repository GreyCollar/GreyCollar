import Box from "@mui/material/Box";
import ChatDisplay from "./ChatDisplay";
import ChatMessageInput from "../../widgets/ChatMessageInput/ChatMessageInput";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import React, { useMemo, useState } from "react";

const predefinedResponses = {
  "What is an AI agent?":
    "An AI agent is a system that can perceive its environment and take actions to achieve its goals.",
  "Can an AI agent think like a human?":
    "Not exactly! AI agents can simulate some aspects of thinking, but they don't truly understand or feel like humans do.",
  "Are AI agents always right?":
    "I try my best, but even AI agents can make mistakes sometimes!",
  "Can AI agents learn?":
    "Some can! Learning agents improve their performance over time using data and experience.",
  "Do AI agents sleep?": "I don't need sleep—I'm always here when you need me!",
  "Can AI agents take over the world?":
    "That's more science fiction than reality. I'm just here to help!",
  "Are you a smart AI agent?":
    "I'd like to think so! I've read a lot of books—digitally, of course.",
  "Can I train my own AI agent?":
    "Absolutely! With the right tools and data, anyone can build and train an AI agent.",
};

function ResponsibilityChat({ onAiResponse, selectedItem }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    []
  );

  const addMessage = (message, role = "user") => {
    setMessages((prevMessages) => [...prevMessages, { text: message, role }]);

    if (role === "user" && predefinedResponses[message]) {
      setLoading(true);
      setTimeout(() => {
        const response = predefinedResponses[message];
        addMessage(response, "assistant");
        if (onAiResponse) {
          onAiResponse(response);
        }
        setLoading(false);
      }, 2000);
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
      <ChatDisplay
        loading={loading}
        messages={messages}
        selectedItem={selectedItem}
      />
      <ChatMessageInput
        onSendMessage={addMessage}
        editor={editor}
        sideChat={true}
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
