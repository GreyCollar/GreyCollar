import { GitHub } from "@mui/icons-material";
import WelcomeMessage from "./WelcomeMessage";

import { Box, Fab, Tooltip, useTheme } from "@mui/material";

const ChatDisplay = () => {
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
        paddingTop: "20px",
      }}
    >
      <Tooltip
        title="GreyCollar"
        onClick={() =>
          window.open("https://github.com/GreyCollar/GreyCollar", "_blank")
        }
        sx={{
          position: "absolute",
          top: "30px",
          right: "20px",
          cursor: "pointer",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Fab variant="button">
          <GitHub />
        </Fab>
      </Tooltip>

      <WelcomeMessage />
    </Box>
  );
};

export default ChatDisplay;
