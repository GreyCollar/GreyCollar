import SendIcon from "@mui/icons-material/Send";

import { Box, IconButton, TextField, useTheme } from "@mui/material";
import React, { useRef, useState } from "react";

const MessageInput = ({ addMessage }) => {
  const theme = useTheme();
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setIsInputEmpty(!event.target.value.trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = inputRef.current.value.trim();
    if (message) {
      addMessage(message);
      inputRef.current.value = "";
      setIsInputEmpty(true);
    }
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
      onSubmit={handleSubmit}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
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
          placeholder="Type here what you want your colleague to do."
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
};

export default MessageInput;
