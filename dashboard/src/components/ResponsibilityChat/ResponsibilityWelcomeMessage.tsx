import { Box } from "@mui/material";

const ResponsibilityWelcomeMessage = () => {
  return (
    <Box
      data-cy="chat-welcome-message"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
      }}
    >
      <img
        src="https://cdn.nucleoid.com/greycollar/media/icon.png"
        alt="GreyCollar logo"
        style={{ width: "50px", height: "50px" }}
      />
    </Box>
  );
};

export default ResponsibilityWelcomeMessage;
