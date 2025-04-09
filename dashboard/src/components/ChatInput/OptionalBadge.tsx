import InlineChromiumBugfix from "./InlineChromiumBugFix";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { css } from "@emotion/react";

import { Stack, alpha } from "@mui/material";

const OptionalBadge = ({ attributes, children }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      className={css`
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        margin-left: 1rem;
      `}
    >
      <InlineChromiumBugfix />
      <Stack
        sx={{
          width: "2rem",
          height: "2rem",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          borderRadius: "50%",
          bgcolor: (theme) => alpha(theme.palette.background.neutral, 0.9),
        }}
      >
        <NavigateNextIcon />
      </Stack>

      {children}
      <InlineChromiumBugfix />
    </span>
  );
};

export default OptionalBadge;
