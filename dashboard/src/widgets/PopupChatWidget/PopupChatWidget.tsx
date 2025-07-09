import { Iconify } from "@nucleoidai/platform/minimal/components";
import PopChat from "../../components/PopChat";
import { useEvent } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";
import useResponsibility from "../../hooks/useResponsibility";
import useSession from "../../hooks/useSession";

import { Badge, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";

const PopupChatWidget = ({
  readOnly,
  conversationId,
  openPopChat,
  setOpenPopChat,
  sessionId,
  sound,
}: {
  readOnly?: boolean;
  conversationId?: string;
  openPopChat?: boolean;
  setOpenPopChat?: (open: boolean) => void;
  sessionId?: string;
  sound?: boolean;
}) => {
  const { colleagueId } = useParams();
  const [open, setOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [selectedResponsibility, setSelectedResponsibility] = useState("");

  const { conversations, sendMessage, getSession } = useSession(colleagueId);
  const { getResponsibility } = useResponsibility();
  const { responsibility } = getResponsibility();

  const [aiResponded] = useEvent("AI_RESPONDED", null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (conversations.length > 0) {
      setMessages(conversations);
    }
  }, [conversations]);

  useEffect(() => {
    if (aiResponded !== null) {
      setUnreadMessages(true);
    }
  }, [aiResponded]);

  useEffect(() => {
    if (openPopChat && sessionId) {
      getSession(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopChat, sessionId]);

  const handleNewUserMessage = async (content) => {
    const newMessage = {
      role: "USER",
      content,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessage(content);
  };

  const handleClose = () => {
    openPopChat ? setOpenPopChat(false) : setOpen(false);
    setUnreadMessages(false);
  };

  return (
    <>
      <PopChat
        title={`Test Chat Session`}
        open={openPopChat || open}
        handleClose={handleClose}
        history={messages}
        closeButton={true}
        handleNewUserMessage={handleNewUserMessage}
        readOnly={readOnly}
        selectedConversationId={conversationId || null}
        sound={sound}
        responsibilities={
          Array.isArray(responsibility) ? responsibility : [responsibility]
        }
        selectedResponsibility={selectedResponsibility}
        onResponsibilityChange={setSelectedResponsibility}
        sx={{}}
      />
      {!open && !readOnly && (
        <Fab onClick={() => setOpen(!open)} size="small">
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            color="success"
            overlap="circular"
            badgeContent=" "
            invisible={!unreadMessages}
          >
            <Iconify
              icon={
                open ? "solar:chat-round-bold-duotone" : "solar:chat-round-bold"
              }
              sx={{ width: 24, height: 24 }}
            />
          </Badge>
        </Fab>
      )}
    </>
  );
};

export default PopupChatWidget;
