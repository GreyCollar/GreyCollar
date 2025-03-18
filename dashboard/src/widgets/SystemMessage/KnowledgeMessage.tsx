import { Label } from "@nucleoidai/platform/minimal/components";
import ReplyIcon from "@mui/icons-material/Reply";
import SourcedAvatar from "../../components/SourcedAvatar/SourcedAvatar";
import { fDateTime } from "../../utils/formatTime";
import useColleague from "../../hooks/useColleague";
import { useEffect } from "react";
import useKnowledge from "../../hooks/useKnowledge";

import { Chip, IconButton, Stack, Typography, alpha } from "@mui/material";

function KnowledgeMessage({ id, handleClick, onDateFetched }) {
  const { getKnowledge } = useKnowledge();

  const { knowledge } = getKnowledge(id);

  const { colleague } = useColleague(knowledge.colleagueId);

  useEffect(() => {
    if (knowledge) {
      onDateFetched(fDateTime(knowledge.createdAt, "MMM DD, YYYY"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledge?.createdAt]);

  return (
    <Stack
      data-cy="knowledge-message"
      sx={{
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: "100%",
            borderRadius: 1,
            typography: "body2",
            color: "grey.800",
            background: (theme) => alpha(theme.palette.background.default, 1),
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Chip
              avatar={
                <SourcedAvatar
                  name={colleague.name}
                  source={"MINIMAL"}
                  avatarUrl={colleague.avatar}
                  sx={{ ml: 1, width: 18, height: 18 }}
                />
              }
              label={colleague.name}
              size="small"
              color="primary"
              variant="filled"
            />
            <Typography variant="body2" color="grey.500" sx={{ ml: 1, my: 1 }}>
              {knowledge.status === "COMPLETED"
                ? "used"
                : knowledge.status === "IN_PROGRESS"
                ? "is using"
                : ""}
            </Typography>
            <Label
              sx={{
                backgroundColor: "rgba(2,136,209, .6)",
                color: "rgba(79,195,247, .6)",
                mx: 1,
                textTransform: "none",
              }}
            >
              /learn-{knowledge.type?.toLowerCase()}
            </Label>
            <Typography variant="body2" color="grey.500" sx={{ mr: 1 }}>
              with
            </Typography>
            {knowledge.type === "TEXT" ? (
              <Label
                sx={{
                  backgroundColor: "rgba(2,136,209, .6)",
                  color: "rgba(79,195,247, .6)",
                  textTransform: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  my: 0.2,
                }}
              >
                {knowledge.text}
              </Label>
            ) : knowledge.type === "QA" ? (
              <>
                <Typography variant="body2" color="grey.500" sx={{ mr: 1 }}>
                  question
                </Typography>
                <Label
                  sx={{
                    backgroundColor: "rgba(2,136,209, .6)",
                    color: "rgba(79,195,247, .6)",
                    mr: 1,
                    textTransform: "none",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    my: 0.2,
                  }}
                >
                  {knowledge.question}
                </Label>
                <Typography variant="body2" color="grey.500" sx={{ mr: 1 }}>
                  answer
                </Typography>
                <Label
                  sx={{
                    backgroundColor: "rgba(2,136,209, .6)",
                    color: "rgba(79,195,247, .6)",
                    textTransform: "none",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    my: 0.2,
                  }}
                >
                  {knowledge.answer}
                </Label>
              </>
            ) : knowledge.type === "URL" ? (
              <Label
                sx={{
                  backgroundColor: "rgba(2,136,209, .6)",
                  color: "rgba(79,195,247, .6)",
                  textTransform: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  my: 0.2,
                }}
              >
                {knowledge.url}
              </Label>
            ) : null}
          </Stack>
        </Stack>

        {knowledge.status === "IN_PROGRESS" ? (
          <IconButton
            onClick={() => handleClick(knowledge)}
            data-cy="reply-button"
          >
            <ReplyIcon />
          </IconButton>
        ) : null}
      </Stack>

      <Typography
        noWrap
        variant="caption"
        sx={{
          color: "text.disabled",
        }}
      >
        {(() => {
          switch (knowledge.status) {
            case "IN_PROGRESS":
              return "Read";
            case "COMPLETED":
              return "Completed";
            default:
              return knowledge.status;
          }
        })()}
      </Typography>
    </Stack>
  );
}

export default KnowledgeMessage;
