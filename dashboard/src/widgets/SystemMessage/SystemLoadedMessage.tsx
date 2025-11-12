import { Label } from "@canmingir/link/platform/components";
import ReplyIcon from "@mui/icons-material/Reply";
import { fDateTime } from "../../utils/formatTime";
import { useEffect } from "react";

import { IconButton, Stack, Typography } from "@mui/material";

function SystemLoadedMessage({ handleClick, command, message, onDateFetched }) {
  useEffect(() => {
    if (message) {
      onDateFetched(fDateTime(message.createdAt, "YYYY-MM-DD HH:mm:ss"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: 1,
      }}
    >
      <div data-cy="system-card">
        <Stack
          data-cy="system-item"
          sx={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Stack
            sx={{
              p: 1.5,
              minWidth: 48,
              maxWidth: 250,
              borderRadius: 1,
              typography: "body2",
              color: "grey.800",
              background: (theme) => theme.palette.background.default,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="grey.500" sx={{ mx: 1 }}>
              used
            </Typography>
            <Label color="success">{command}</Label>
          </Stack>
          <IconButton onClick={() => handleClick(command)}>
            <ReplyIcon />
          </IconButton>
        </Stack>
      </div>

      <Typography
        noWrap
        variant="caption"
        sx={{
          color: "text.disabled",
        }}
      >
        {(() => {
          switch (message?.status) {
            case "READ":
              return "Read";
            case "COMPLETED":
              return "Completed";
            default:
              return message?.status;
          }
        })()}
      </Typography>
    </Stack>
  );
}

export default SystemLoadedMessage;
