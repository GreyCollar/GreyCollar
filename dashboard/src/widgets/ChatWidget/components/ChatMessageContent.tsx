import Box from "@mui/material/Box";
import ChatMessageItem from "./ChatMessageItem";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { ReactEditor } from "slate-react";
import SystemMessage from "../../SystemMessage/SystemMessage";
import { Types } from "../../../components/ChatInput/chat.config";

import { Label, Scrollbar } from "@nucleoidai/platform/minimal/components";
import { memo, useEffect, useRef } from "react";

const ChatMessageContent = memo(function ChatMessageList({
  user,
  messages,
  replied,
  editor,
  selectedMessage,
  isReplying,
  setIsReplying,
}: {
  user: { id: string; name: string; role: string };
  messages: Array<{
    id: string;
    role: string;
    content: string;
    colleagueId: string;
    knowledgeId: string;
    createdAt: string;
    userId: string;
    command: string;
    mode?: string;
  }>;
  replied: React.MutableRefObject<boolean>;
  editor: ReactEditor;
  selectedMessage: React.MutableRefObject<{
    id: string;
    role: string;
    content: string;
    colleagueId: string;
    knowledgeId: string;
    createdAt: string;
    userId: string;
    command: string;
    mode?: string;
  } | null>;
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const messagesEndRef = useRef(null);

  const handleClick = (message) => {
    setIsReplying(true);
    selectedMessage.current = message;
    scrollMessagesToBottom();
    ReactEditor.focus(editor);
  };

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages]);

  const scrollMessagesToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const Colors = Types.reduce(
    (colors, type) => {
      colors[type.name] = type.replyColor;
      return colors;
    },
    { default: "rgba(69, 79, 91, .5)" }
  );

  const titles = selectedMessage.current?.mode || selectedMessage.current?.role;

  const renderMessages = (message) => {
    if (!message) return null;

    switch (message.role) {
      case "SYSTEM": {
        const type = message.mode;
        return (
          <SystemMessage
            key={message.id}
            id={message.id}
            type={type}
            message={message}
            loading={false}
            handleClick={() => handleClick(message)}
          />
        );
      }
      case "ASSISTANT":
        return (
          <ChatMessageItem
            key={message.id}
            content={message.content}
            message={message}
            handleClick={() => handleClick(message)}
            isAI={message.role === "ASSISTANT"}
            user={user}
            replied={""}
          />
        );
      case "USER":
        return (
          <ChatMessageItem
            key={message.id}
            replied={replied}
            message={message}
            messages={messages}
            handleClick={() => handleClick(message)}
            content={message.content}
            isAI={message.role === "ASSISTANT"}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>{messages.map((message) => renderMessages(message))}</Box>
      </Scrollbar>
      {isReplying && (
        <>
          <Label
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              fontSize: "14px",
              borderRadius: "5px",
              backgroundColor:
                Colors[selectedMessage.current?.mode] || Colors.default,
              color: "grey",
            }}
          >
            <span>Replying to {titles}</span>
            <IconButton onClick={() => setIsReplying(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Label>
        </>
      )}
    </>
  );
});

export default ChatMessageContent;
