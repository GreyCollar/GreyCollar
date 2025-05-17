import http from "../../http";
import { publish } from "@nucleoidai/react-event";

const learnAction = async (command) => {
  const colleague = command.get("COLLEAGUE");
  const name = command.get("NAME");
  const url = command.get("URL");
  const text = command.get("TEXT");
  const question = command.get("QA");
  const answer = command.get("ANSWER");

  let type;

  if (url && !text && !question && !answer) {
    type = "URL";
  }
  if (question && answer && !url && !text) {
    type = "QA";
  }
  if (text && !url && !question && !answer) {
    type = "TEXT";
  }

  const { data: createdKnowledge } = await http.post(`/knowledge`, {
    type,
    question,
    answer,
    url,
    text,
    colleagueId: colleague.id,
  });

  publish("KNOWLEDGE_STATUS_CHANGED", {
    ...createdKnowledge,
    commandName: name,
    colleague,
  });

  const intervalId = setInterval(async () => {
    const { data: knowledge } = await http.get(`/knowledge`);
    if (knowledge.status === "COMPLETED") {
      clearInterval(intervalId);
      publish("KNOWLEDGE_STATUS_CHANGED", {
        ...knowledge,
        commandName: name,
        colleague,
      });
    } else {
      console.log("Knowledge status:", knowledge.status);
    }
  }, 5000);
};

const taskAction = async (command) => {
  const colleague = command.get("COLLEAGUE");
  const name = command.get("NAME");
  const task = command.get("TEXT");

  const { data: createdTask } = await http.post(`/tasks`, {
    description: task,
    colleagueId: colleague.id,
  });

  publish("TASK_STATUS_CHANGED", {
    ...createdTask,
    commandName: name,
    colleague,
  });

  const intervalId = setInterval(async () => {
    const { data: task } = await http.get(`/tasks/${createdTask.id}`);
    if (task.status === "COMPLETED") {
      clearInterval(intervalId);
      publish("TASK_STATUS_CHANGED", {
        ...task,
        commandName: name,
        colleague,
      });
    } else {
      console.log("Task status:", task.status);
    }
  }, 5000);
};

const Commands = [
  {
    action: (inputs) => learnAction(inputs),
    name: "/learn",
    description: "Learn something new",
    icon: "mdi:learn-outline",
    next: {
      type: "COLLEAGUE",
      next: {
        type: "DROPDOWN",
        label: "Select a Type",
        list: [
          { name: "QA", icon: "ic:twotone-question-answer" },
          { name: "URL", icon: "mdi:search-web" },
          { name: "TEXT", icon: "tabler:text-size" },
        ],
        action: (input) => {
          if (input === "QA") return "qaInput";
          else if (input === "URL") return "urlInput";
          else if (input === "TEXT") return "textInput";
        },
        next: {
          qaInput: {
            type: "QA",
            next: { label: "Enter Answer", type: "ANSWER" },
          },
          urlInput: {
            type: "URL",
          },
          textInput: {
            type: "TEXT",
          },
        },
      },
    },
  },
  {
    action: (inputs) => learnAction(inputs),
    name: "/learn-url",
    description: "Learn something new from a URL",
    icon: "mdi:search-web",
    next: {
      type: "COLLEAGUE",
      next: {
        label: "Enter URL",
        type: "URL",
      },
    },
  },
  {
    action: (inputs) => learnAction(inputs),
    name: "/learn-text",
    description: "Learn something new from a text",
    icon: "tabler:text-size",
    next: {
      type: "COLLEAGUE",
      next: {
        label: "Enter Text",
        type: "TEXT",
      },
    },
  },
  {
    action: (inputs) => learnAction(inputs),
    name: "/learn-qa",
    description: "Learn something new from a QA",
    icon: "ic:twotone-question-answer",
    next: {
      type: "COLLEAGUE",
      next: {
        label: "Enter QA",
        type: "QA",
        next: {
          label: "Enter Answer",
          type: "ANSWER",
        },
      },
    },
  },
  {
    action: (inputs) => taskAction(inputs),
    name: "/task",
    description: "Create a task",
    icon: "clarity:tasks-solid",
    next: {
      type: "COLLEAGUE",
      next: {
        label: "Enter Task",
        type: "TEXT",
      },
    },
  },
];

const ResponsibilityCommands = [
  {
    id: "integration",
    label: "Integration",
    type: "integration",
    icon: "carbon:ibm-cloud-pak-integration",
    description: "Integrate with other tools",
    next: {
      label: "Select an Integration",
      list: [
        { id: "g-drive-id", name: "Google Drive", icon: "mdi:google-drive" },
        { id: "slack-id", name: "Slack", icon: "mdi:slack" },
        { id: "github-id", name: "Github", icon: "mdi:github" },
      ],
    },
  },
  {
    id: "handoff",
    label: "Handoff",
    type: "handoff",
    icon: "carbon:ibm-cloud-pak-business-automation",
  },
  {
    id: "mention",
    label: "Mention",
    type: "mention",
    icon: "mdi:at",
  },
];

const Types = [
  {
    name: "SUPERVISING",
    replyColor: "rgba(66,165,245, .6)",
    replyAction: async (selectedMessage, replyText) => {
      await http.patch(
        `supervisings/${selectedMessage.referenceId}`,
        {
          status: "ANSWERED",
          answer: replyText,
        },
        publish("SUPERVISING_ANSWERED", selectedMessage)
      );
    },
  },
  {
    name: "KNOWLEDGE",
    replyColor: "rgba(2,136,209, .6)",
    replyAction: () => {
      console.log("No reply action for KNOWLEDGE");
    },
  },
  {
    name: "TASK",
    replyColor: "rgba(171,71,188, .6)",
    replyAction: () => {
      console.log("No reply action for TASK");
    },
  },
];

export { Commands, Types, ResponsibilityCommands };
