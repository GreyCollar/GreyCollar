import { Box, Typography } from "@mui/material";

const WelcomeMessage = () => {
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
      <Typography variant="h4" gutterBottom sx={{ marginBottom: "4px" }}>
        GreyCollar
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>
        Build your logical context
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
