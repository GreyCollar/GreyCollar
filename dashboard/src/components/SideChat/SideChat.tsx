import Box from "@mui/material/Box";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";

function SideChat() {
const predefinedResponses = {
  "What is an AI agent?":
    "An AI agent is a system that can perceive its environment and take actions to achieve its goals.",
  "Can an AI agent think like a human?":
    "Not exactly! AI agents can simulate some aspects of thinking, but they don't truly understand or feel like humans do.",
  "Are AI agents always right?":
    "I try my best, but even AI agents can make mistakes sometimes!",
  "Can AI agents learn?":
    "Some can! Learning agents improve their performance over time using data and experience.",
  "Do AI agents sleep?": "I don't need sleep—I'm always here when you need me!",
  "Can AI agents take over the world?":
    "That's more science fiction than reality. I'm just here to help!",
  "Are you a smart AI agent?":
    "I'd like to think so! I've read a lot of books—digitally, of course.",
  "Can I train my own AI agent?":
    "Absolutely! With the right tools and data, anyone can build and train an AI agent.",
};
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.paper,
        paddingTop: "10px",
        paddingX: "10px",
        height: "100%",
        width: 700,
      }}
    >
      <ChatDisplay
        loading={loading}
        messages={messages}
        selectedItem={selectedItem}
      />
      <MessageInput addMessage={addMessage} />
    </Box>
  );
}

export default SideChat;
