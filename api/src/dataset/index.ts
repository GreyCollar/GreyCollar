import chat from "./train/chat.json";
import diamond from "./train/diamond.json";
import policy from "./policy.json";
import responsibility from "./train/responsibility.json";
import responsibilityName from "./train/responsibility-name.json";
import responsibilityToTask from "./train/responsibility-to-task.json";
import task from "./train/task.json";
import teamChat from "./train/team-chat.json";

export default {
  policy: {
    role: "system" as const,
    content: JSON.stringify({ policy }),
  },
  train: {
    responsibilityToTask: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityToTask,
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
    responsibility: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibility,
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

