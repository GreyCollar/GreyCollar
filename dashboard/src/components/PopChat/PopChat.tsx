import Draggable from "react-draggable";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import ResponsibilitySelector from "../ResponsibilitySelector";
import { Scrollbar } from "@nucleoidai/platform/minimal/components";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import styles from "./styles";
import { useEvent } from "@nucleoidai/react-event";
import useSound from "use-sound";

import { Box, Fab, IconButton, TextField } from "@mui/material";
import { Head, LoadingMessage, MessageList } from "./components";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

const sub = { item: null };
const response = (res) => {
  sub.item = res;
};

export const handleAddResponseMessage = (ret) => {
  sub.item(ret);
};

const PopChat = ({
  selectedConversationId,
  title,
  open,
  handleClose,
  handleNewUserMessage,
  history = [],
  readOnly,
  closeButton,
  sound,
  responsibilities,
  selectedResponsibility,
  onResponsibilityChange,
  //eslint-disable-next-line
  sx,
}) => {
  const [aiResponded] = useEvent("AI_RESPONDED", null);
  const [conversationSent] = useEvent("CONVERSATION_SENT", null);

  const MessageSfx = "/src/components/PopChat/messageSFX.mp3";

  const [messages, setMessages] = useState([]);
  const [mute, setMute] = useState(false);
  const [loading, setLoading] = useState(false);

  const [play] = useSound(MessageSfx);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const highlightedMessage = useRef(null);

  const scrollToBottom = useCallback(() => {
    highlightedMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const handleSend = useCallback(
    (messageContent) => {
      if (!messageContent.trim()) return;

      setMessages((prev) => [
        ...prev,
        { content: messageContent, role: "USER" },
      ]);
      handleNewUserMessage(messageContent);
      !mute && play();
      setLoading(true);
    },
    [handleNewUserMessage, mute, play]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const content = inputRef.current?.value?.trim();
        if (content) {
          handleSend(content);
          inputRef.current.value = "";
        }
      }
    },
    [handleSend]
  );

  const changeMute = useCallback(() => {
    setMute((prev) => !prev);
  }, []);

  useEffect(() => {
    response((ret) => {
      setMessages((prev) => [...prev, { content: ret, role: "AI" }]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setMessages(history);
  }, [history]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, aiResponded, scrollToBottom]);

  useEffect(() => {
    if (selectedConversationId) {
      scrollToBottom();
    }
  }, [selectedConversationId, scrollToBottom]);

  useEffect(() => {
    if (!sound) {
      setLoading(false);
      return;
    } else if (aiResponded !== null) {
      setLoading(false);

      !mute && play();
    }
    // eslint-disable-next-line
  }, [aiResponded, mute, play]);

  const renderIndicator = useCallback(() => {
    if (conversationSent?.createdAt > aiResponded?.createdAt) return true;
    if (loading) return true;
    if (conversationSent && aiResponded === null) return true;
    return false;
  }, [conversationSent, aiResponded, loading]);

  if (!open) return null;

  return (
    <Draggable cancel={".noDrag"}>
      <Box sx={readOnly ? styles.readOnlyBoxHeader : styles.boxHeader}>
        <Head
          title={title}
          mute={mute}
          changeMute={changeMute}
          handleClose={handleClose}
          readOnly={readOnly}
        />

        {responsibilities.length > 0 && !readOnly && (
          <ResponsibilitySelector
            responsibilities={responsibilities}
            selectedResponsibility={selectedResponsibility}
            onResponsibilityChange={onResponsibilityChange}
          />
        )}

        <Stack
          sx={{
            height: "100%",
            width: "100%",
            p: 1,
            overflowY: "auto",
            overflowX: "hidden",
            flexDirection: "column",
            backgroundColor: (theme) => theme.palette.background.paper,
            boxShadow: 2,
            borderRadius: readOnly ? "0px 0px 7px 7px" : "0px",
          }}
        >
          <Scrollbar sx={{ height: "100%" }}>
            <MessageList
              messages={messages}
              selectedId={selectedConversationId}
              messagesEndRef={messagesEndRef}
              highlightedMessage={highlightedMessage}
            />
            {renderIndicator() && <LoadingMessage />}
          </Scrollbar>
        </Stack>

        {!readOnly && (
          <Box
            sx={{
              width: "100%",
              p: 1,
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              boxShadow: 20,
              borderRadius: "0px 0px 7px 7px",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                className="noDrag"
                variant="outlined"
                autoComplete="off"
                fullWidth
                inputRef={inputRef}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        const content = inputRef.current?.value?.trim();
                        if (content) {
                          handleSend(content);
                          inputRef.current.value = "";
                        }
                      }}
                    >
                      <Iconify
                        icon="material-symbols:send"
                        sx={{
                          width: 22,
                          height: 22,
                          color: (theme) =>
                            inputRef.current?.value
                              ? alpha(theme.palette.primary.main, 0.6)
                              : "inherit",
                        }}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Stack>
          </Box>
        )}

        <Box
          sx={{ width: "100%", p: 1, display: "flex", justifyContent: "end" }}
        >
          <Fab
            className="handle"
            onClick={closeButton ? handleClose : undefined}
            sx={{ cursor: "pointer" }}
            color="primary"
          >
            <Iconify
              icon="solar:chat-round-bold-duotone"
              sx={{ width: 36, height: 36 }}
            />
          </Fab>
        </Box>
      </Box>
    </Draggable>
  );
};

export default memo(PopChat);
