import chat from "./train/chat.json";
import diamond from "./train/diamond.json";
import policy from "./policy.json";
import responsibility from "./train/responsibility.json";
import responsibilityChat from "./train/responsibility-chat.json";
import responsibilityName from "./train/responsibility-name.json";
import task from "./train/task.json";
import teamChat from "./train/team-chat.json";

export default {
  policy: {
    role: "system" as const,
    content: JSON.stringify({ policy }),
  },
  train: {
    responsibility: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibility,
      }),
    },
    chat: {
      role: "system" as const,
      content: JSON.stringify({
        train: chat,
      }),
    },
    task: {
      role: "system" as const,
      content: JSON.stringify({
        train: task,
      }),
    },
    teamChat: {
      role: "system" as const,
      content: JSON.stringify({
        train: teamChat,
      }),
    },
    responsibilityChat: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityChat,
      }),
    },
    responsibilityName: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityName,
      }),
    },
    diamond: {
      role: "system" as const,
      content: JSON.stringify({
        train: diamond,
      }),
    },
  },
};
