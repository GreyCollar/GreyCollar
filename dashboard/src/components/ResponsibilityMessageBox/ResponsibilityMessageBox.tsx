import React from "react";

import { Box, Typography } from "@mui/material";

function ResponsibilityMessageBox({ message }) {
  return (
    <Box
      data-cy="message-box"
      sx={{
        width: "100%",
        marginBottom: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        padding: "10px",
        borderRadius: "10px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        userSelect: "text",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", marginBottom: "8px", userSelect: "text" }}
        data-cy="message-role"
      >
        {message.role === "user" ? "You" : "Assistant"}
      </Typography>
      <Typography
        variant="body1"
        sx={{ userSelect: "text" }}
        data-cy="message-content"
      >
        {message.content}
      </Typography>
    </Box>
  );
}

export default ResponsibilityMessageBox;
