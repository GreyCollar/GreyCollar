import ReplyIcon from "@mui/icons-material/Reply";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fDateTime } from "../../../utils/formatTime";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTeamDetails from "../../../hooks/useTeamDetails";

import { Avatar, Box, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material";

function TeamChatMessageItem({
  user,
  content,
  isAI,
  replied,
  message,
  messages = {}, // Add default empty array
  handleClick,
}) {
  const repliedMessage = Array.isArray(messages)
    ? messages.find((msg) => msg?.id === message?.replyTo)
    : undefined;

  const { teamDetails } = useTeamDetails();

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm")); // 0 - 600
  const smAndMd = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600 - 900
  const mdAndLg = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900 - 1200
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(500));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between(500, 1075));

  const formatContent = (content) => {
    if (typeof content === "string" && content.includes("@{")) {
      const mentionObject = content.match(/@{.*?}/g);
      if (mentionObject) {
        const nameMatch = mentionObject[0].match(/name: '([^']+)'/);
        if (nameMatch) {
          const name = nameMatch[1];
          const mentionIndex = content.indexOf(mentionObject[0]);
          const remainingContent = content.replace(mentionObject[0], "").trim();
          const remainingIndex = content.indexOf(remainingContent);

          const mentionBox = (
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.background.neutral, 0.1),
                color: "white",
                borderRadius: "5px 8px 8px 5px",
                padding: "0 0.5rem",
                fontSize: "0.9rem",
                display: "inline-flex",
                flexDirection: "row",
                alignItems: "center",
                height: "22px",
              }}
            >
              {name}
            </Box>
          );

          if (remainingIndex < mentionIndex) {
            return (
              <span>
                <span>{remainingContent} </span>
                {mentionBox}
              </span>
            );
          } else {
            return (
              <span>
                {mentionBox}
                <span>{` ${remainingContent}`}</span>
              </span>
            );
          }
        }
      }
    }
    return content;
  };

  function truncateMessage(content) {
    const formattedContent = formatContent(content);
    if (isSmallScreen) {
      return typeof formattedContent === "string"
        ? formattedContent.substring(0, 250)
        : formattedContent;
    }
    return formattedContent;
  }

  function truncateContent(content) {
    const formattedContent = formatContent(content);
    if (typeof formattedContent !== "string") {
      return formattedContent;
    }
    if (isSmallScreen) {
      return formattedContent.substring(0, 115);
    } else if (isMediumScreen) {
      return formattedContent.substring(0, 120);
    }
    return formattedContent.substring(0, 290);
  }

  const renderInfo = message.createdAt ? (
    <Typography
      noWrap
      variant="caption"
      sx={{
        color: "text.disabled",
      }}
    >
      {fDateTime(message.createdAt, "MMM DD, YYYY")}
    </Typography>
  ) : null;

  const renderSender = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        color: "text.disabled",
      }}
    >
      {isAI ? teamDetails.coach : user?.name}
    </Typography>
  );

  const renderBody =
    replied && repliedMessage ? (
      <Stack
        direction="column"
        display="flex"
        alignItems="flex-start"
        sx={{
          bgcolor: "background.neutral",
          borderRadius: 1,
          width: "100%",
        }}
      >
        <Stack
          sx={{
            p: 0.5,
            width: smDown ? "84vw" : smAndMd ? "87vw" : "100%",
            minWidth: "100%",
            height: 50,
            borderRadius: 1,
            typography: "body2",
            bgcolor: "rgba(255, 172, 51, .3)",
            color: "background.paper",
          }}
        >
          {repliedMessage && truncateContent(repliedMessage.content)}
        </Stack>

        <Stack direction="row" display="flex" alignItems="center">
          <Box
            sx={{
              position: "relative",
              padding: "10px",
              ":hover": {
                ".reply-icon": {
                  visibility: "visible",
                },
              },
            }}
          >
            <Stack
              direction="column"
              spacing={2}
              sx={{
                p: 3,
                borderRadius: 1,
                maxHeight: 250,
                minHeight: 20,
                width: smDown
                  ? "74vw"
                  : smAndMd
                  ? "84vw"
                  : mdAndLg
                  ? "78vw"
                  : "100%",
                typography: "body2",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                backgroundColor: "none",
                ":hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {!isAI ? (
                  <Avatar src={user.avatarUrl} />
                ) : (
                  <SourcedAvatar
                    source="MINIMAL"
                    avatarUrl={teamDetails.coachAvatar}
                  />
                )}
                {renderSender}
                {renderInfo}
              </Stack>

              {truncateMessage(content)}
            </Stack>

            <Typography
              noWrap
              variant="caption"
              sx={{
                color: "text.disabled",
                position: "absolute",
                bottom: 18,
                right: 20,
              }}
            >
              {(() => {
                switch (message.status) {
                  case "READ":
                    return "Read";
                  case "RECEIVED":
                    return "Received";
                  default:
                    return message.status;
                }
              })()}
            </Typography>

            <IconButton
              data-cy="reply-button"
              className="reply-icon"
              sx={{
                position: "absolute",
                top: 5,
                right: 10,
                visibility: "hidden",
              }}
              onClick={() => handleClick(message)}
            >
              <ReplyIcon />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    ) : (
      <Stack direction="row" display="flex" alignItems="center">
        <Box
          data-cy="message-content"
          sx={{
            position: "relative",
            ":hover": {
              ".reply-icon": {
                visibility: "visible",
              },
            },
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              p: 3,
              borderRadius: 1,
              maxHeight: 250,
              minHeight: 20,
              width: smDown
                ? "84vw"
                : smAndMd
                ? "87vw"
                : mdAndLg
                ? "78vw"
                : "100%",
              typography: "body2",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              backgroundColor: "none",
              ":hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {!isAI ? (
                <Avatar src={user.avatarUrl} />
              ) : (
                <SourcedAvatar
                  source="MINIMAL"
                  avatarUrl={teamDetails.coachAvatar}
                />
              )}
              {renderSender}
              {renderInfo}
            </Stack>

            {truncateMessage(content)}
          </Stack>

          <Typography
            noWrap
            variant="caption"
            sx={{
              color: "text.disabled",
              position: "absolute",
              bottom: 5,
              right: 10,
            }}
          >
            {(() => {
              switch (message.status) {
                case "READ":
                  return "Read";
                case "RECEIVED":
                  return "Received";
                default:
                  return message.status;
              }
            })()}
          </Typography>

          <IconButton
            data-cy="reply-button"
            className="reply-icon"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              visibility: "hidden",
            }}
            onClick={() => handleClick(message)}
          >
            <ReplyIcon />
          </IconButton>
        </Box>
      </Stack>
    );

  return (
    <Stack
      data-cy="message-item"
      data-status={message.status}
      direction="row"
      justifyContent="flex-start"
      sx={{
        p: 2,
        mb: -3,
        width: "100%",
      }}
    >
      <Stack alignItems="flex-start">{renderBody}</Stack>
    </Stack>
  );
}

export default TeamChatMessageItem;
