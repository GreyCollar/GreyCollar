import ResponsibilityMessageBox from "../ResponsibilityMessageBox/ResponsibilityMessageBox";
import ResponsibilityWelcomeMessage from "./ResponsibilityWelcomeMessage";

import { Box, CircularProgress, useTheme } from "@mui/material";

const ResponsibilityChatContent = ({ loading, messages }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingX: { xs: "12px", sm: "16px", md: "20px" },
        paddingTop: "8px",
        paddingBottom: "8px",
        minHeight: 0,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.divider,
          borderRadius: "3px",
          "&:hover": {
            background: theme.palette.text.disabled,
          },
        },
      }}
    >
      {messages.length === 0 && <ResponsibilityWelcomeMessage />}

      {messages.map((message, index) => (
        <ResponsibilityMessageBox key={index} message={message} />
      ))}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
          }}
        >
          <CircularProgress
            size={24}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ResponsibilityChatContent;
