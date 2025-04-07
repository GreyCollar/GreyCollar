import Card from "@mui/material/Card";
import ChatHeaderDetail from "./components/ChatHeaderDetail.jsx";
import ChatMessageContent from "./components/ChatMessageContent.jsx";
import ChatMessageInput from "../ChatMessageInput/ChatMessageInput.js";
import ChatNav from "./components/ChatNav.jsx";
import { Commands } from "../../components/CommandArea/chat.config.js";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { createEditor } from "slate";
import useChat from "../../hooks/useChat.js";
import useColleagues from "../../hooks/useColleagues.js";
import { useMediaQuery } from "@mui/material";
import useMessage from "../../hooks/useMessage.js";
import { useSocket } from "../../hooks/useSocket";
import useSupervisings from "../../hooks/useSupervisings.js";
import useTeam from "../../hooks/useTeam.js";
import { useTheme } from "@mui/material/styles";
import useUser from "../../hooks/useUser.js";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import React, { memo, useCallback, useMemo, useRef, useState } from "react";

const ChatWidget = memo(function ChatWidget({
  projectId,
}: {
  projectId: string;
}) {
  const socket = useSocket();

  const { team, loading: teamLoading } = useTeam(projectId);
  const { colleagues, loading } = useColleagues();

  const { updateSupervising } = useSupervisings();

  const { messages: rawMessages, loading: messagesLoading } = useChat();

  const messages = useMemo(() => {
    return rawMessages.map((message) => ({
      ...message,
      role: message.role || "",
      content: message.content || "",
      colleagueId: message.colleagueId || "",
      knowledgeId: message.knowledgeId || "",
      createdAt: message.createdAt || "",
      userId: message.userId || "",
      command: message.command || "",
      status: message.status || "",
      id: message.id || "",
    }));
  }, [rawMessages]);

  const { createMessage } = useMessage();

  const { user } = useUser();

  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    []
  );

  const [isReplying, setIsReplying] = useState(false);
  const replied = useRef(false);
  const selectedMessage = useRef(null);

  const [collapsed, setCollapsed] = useState(true);

  const sendMessage = useCallback(
    async (message) => {
      const { command } = message;
      if (command) {
        const name = command.get("NAME");
        Commands.find((command) => command.name === name).action(command);

        socket?.emit("command_sent", {
          teamId: projectId,
          colleagueName: command.get("COLLEAGUE").name,
          command: command.get("NAME"),
          createdAt: new Date(),
          from: "Greycollar",
        });
      } else if (selectedMessage.current) {
        if (selectedMessage.current?.mode === "SUPERVISING") {
          await updateSupervising(selectedMessage.current.id, message);
        } else {
          // Send message only if not in SUPERVISING mode
          const messageArray = {
            role: "USER",
            userId: user.id.toString(),
            content: message,
            replyTo: selectedMessage.current.id,
          };
          await createMessage(messageArray);
          setIsReplying(false);
          selectedMessage.current = null;
        }
        setIsReplying(false);
      } else {
        const messageArray = {
          role: "USER",
          userId: user.id.toString(),
          content: message,
        };

        await createMessage(messageArray);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, selectedMessage]
  );

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const details = !!messages;

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, height: mdDown ? 45 : 72 }}
    >
      {teamLoading ? null : (
        <>{details && <ChatHeaderDetail mdDown={mdDown} title={team.name} />}</>
      )}
    </Stack>
  );

  //TODO: Add the following to the renderNav below: show members instead of contacts

  const renderMessages = useMemo(
    () => {
      return (
        <Stack sx={{ width: 1, height: 1, overflow: "hidden" }}>
          {!messagesLoading && (
            <ChatMessageContent
              replied={replied}
              user={user}
              editor={editor}
              messages={messages}
              isReplying={isReplying}
              setIsReplying={setIsReplying}
              selectedMessage={selectedMessage}
            />
          )}
          <ChatMessageInput
            createMessage={createMessage}
            userId={user.id}
            replied={replied}
            selectedMessage={selectedMessage}
            editor={editor}
            disabled={false}
            onSendMessage={sendMessage}
          />
        </Stack>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, replied, isReplying, selectedMessage, sendMessage]
  );
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "calc(100vw - 88px)",
        padding: "0!important",
        [theme.breakpoints.down("lg")]: {
          width: "100vw",
        },
      }}
    >
      <Stack
        component={Card}
        display={{ xs: "grid", md: "flex" }}
        direction={{ md: "row" }}
        sx={{
          height: "100vh",
          margin: "0",
          borderRadius: 0,
        }}
      >
        {loading ? null : (
          <ChatNav
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            colleagues={colleagues}
            loading={loading}
          />
        )}

        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          {renderHead}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: "hidden",
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {renderMessages}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
});

export default ChatWidget;

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
