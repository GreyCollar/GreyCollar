import ResponsibilityChatTitle from "./ResponsibilityChatTitle";
import ResponsibilityMessageBox from "../ResponsibilityMessageBox/ResponsibilityMessageBox";
import ResponsibilityWelcomeMessage from "./ResponsibilityWelcomeMessage";

import { Box, CircularProgress, useTheme } from "@mui/material";

const ResponsibilityChatDisplay = ({ loading, messages, selectedItem }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        paddingX: { xs: "8px", sm: "16px", md: "20px" },
        paddingTop: "5px",
      }}
    >
      <ResponsibilityChatTitle selectedItem={selectedItem} />
      {messages.length === 0 && <ResponsibilityWelcomeMessage />}

      {messages.map((message, index) => (
        <ResponsibilityMessageBox key={index} message={message} />
      ))}

      {loading && (
        <CircularProgress
          sx={{
            color: theme.palette.grey[500],
          }}
        />
      )}
    </Box>
  );
};

export default ResponsibilityChatDisplay;
