import Box from "@mui/material/Box";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";

function SideChat() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.paper,
        paddingBottom: "10px",
        height: "100%",
        width: 700,
      }}
    >
      <ChatDisplay />
      <MessageInput />
    </Box>
  );
}

export default SideChat;
