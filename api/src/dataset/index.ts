import chat from "./train/chat.json";
import policy from "./policy.json";
import pseudo from "./train/pseudo.json";
import responsibility from "./train/responsibility.json";
import responsibilityChat from "./train/responsibility-chat.json";
import responsibilityChatEvaluation from "./train/responsibility-chat-evaluation.json";
import responsibilityDiamond from "./train/responsibility-diamond.json";
import responsibilityName from "./train/responsibility-name.json";
import taskDiamond from "./train/task-diamond.json";
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
    pseudo: {
      role: "system" as const,
      content: JSON.stringify({
        train: pseudo,
      }),
    },
    taskDiamond: {
      role: "system" as const,
      content: JSON.stringify({
        train: taskDiamond,
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
    responsibilityChatEvaluation: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityChatEvaluation,
      }),
    },
    responsibilityName: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityName,
      }),
    },
    responsibilityDiamond: {
      role: "system" as const,
      content: JSON.stringify({
        train: responsibilityDiamond,
      }),
    },
  },
};

