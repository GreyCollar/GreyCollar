import SendIcon from "@mui/icons-material/Send";

import { Box, IconButton, TextField, useTheme } from "@mui/material";
import React, { forwardRef, useRef, useState } from "react";

const MessageInput = forwardRef(() => {
  const theme = useTheme();

  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setIsInputEmpty(!event.target.value.trim());
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
          borderRadius: 1,
          padding: "10px",
          border: `1px solid`,
          borderColor: theme.palette.grey[500],
          backgroundColor: theme.palette.background.default,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          onChange={handleInputChange}
          placeholder="Type your message here..."
          InputProps={{
            disableUnderline: true,
          }}
          inputRef={inputRef}
          multiline
          maxRows={4}
          sx={{ flexGrow: 1 }}
          data-cy="message-input"
        />

        <IconButton
          type="submit"
          disabled={isInputEmpty}
          sx={{ color: theme.palette.grey[500], ml: 1 }}
          data-cy="send-button"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
});

export default MessageInput;
