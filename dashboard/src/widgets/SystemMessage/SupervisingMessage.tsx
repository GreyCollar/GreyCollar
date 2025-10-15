import { Label } from "@canmingir/link/platform/components";
import ReplyIcon from "@mui/icons-material/Reply";
import SourcedAvatar from "../../components/SourcedAvatar/SourcedAvatar";
import { fDateTime } from "../../utils/formatTime";
import useColleague from "../../hooks/useColleague";
import { useEffect } from "react";
import useSupervise from "../../hooks/useSupervise";

import { Chip, IconButton, Stack, Typography, alpha } from "@mui/material";

function SupervisingMessage({ id, handleClick, onDateFetched }) {
  const { supervising } = useSupervise(id);

  const { colleague } = useColleague(supervising.colleagueId);

  useEffect(() => {
    if (supervising) {
      onDateFetched(fDateTime(supervising.createdAt, "MMM DD, YYYY"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervising]);

  return (
    <>
      <Stack
        data-cy="supervising-message"
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
              alignItems: "center",
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
              <Typography variant="body2" color="grey.500" sx={{ m: 1 }}>
                {supervising.status === "ANSWERED"
                  ? "learned"
                  : "wants to learn"}
              </Typography>
              <Label
                sx={{
                  backgroundColor: "rgba(66,165,245, .6)",
                  color: "rgba(227,242,253, .6)",
                  textTransform: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  my: 0.2,
                }}
              >
                {supervising.status === "ANSWERED"
                  ? supervising.answer
                  : supervising.question}
              </Label>
            </Stack>
          </Stack>
          {supervising.status === "IN_PROGRESS" ? (
            <IconButton
              onClick={() => handleClick(supervising)}
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
            switch (supervising.status) {
              case "IN_PROGRESS":
                return "In Progress";
              case "COMPLETED":
                return "Completed";
              default:
                return supervising.status;
            }
          })()}
        </Typography>
      </Stack>
    </>
  );
}

export default SupervisingMessage;
