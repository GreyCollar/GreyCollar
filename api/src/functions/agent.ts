import Integrations from "../integrations/integrations";
import actions from "../actions";
import colleague from "./colleague";
import dataset from "../dataset";
import { generate } from "../lib/llm";
import knowledgeFn from "./knowledge";
import message from "./message";
import messagesFunc from "./message";
import responsibilityFn from "../functions/responsibility";
import session from "./session";
import supervising from "./supervising";
import taskFn from "./task";

async function messages({ teamId }: { teamId: string }) {
  const messageInstances = await messagesFunc.listMessages({ teamId });

  return messageInstances
    .filter(
      (message) => message.role === "USER" || message.role === "ASSISTANT"
    )
    .map(({ role, content }) => ({ role: role.toLowerCase(), content }));
}

async function info({ colleagueId }) {
  const { name, title, character, role } = await colleague.get({ colleagueId });
  return {
    role: "system",
    content: {
      ai_assistant_info: {
        name,
        character,
        title,
        role,
        job: "GreyCollar AI Assistant",
      },
    },
  } as {
    role: "user" | "system" | "assistant";
    content: object;
  };
}

async function knowledge({
  colleagueId,
  taskId,
}: {
  colleagueId: string;
  taskId?: string;
}) {
  const knowledgeList = await knowledgeFn.list({
    colleagueId,
    options: { includeSteps: true },
  });

  const knowledge_base = knowledgeList
    .filter(
      (knowledge) =>
        !taskId || !(knowledge.type === "TASK" && knowledge.taskId === taskId)
    )
    .map(({ type, question, answer, text, content, Task }) => ({
      type,
      question,
      answer,
      text,
      content,
      Task,
    }));

  return {
    role: "system",
    content: {
      knowledge_base,
    },
  } as {
    role: "user" | "system" | "assistant";
    content: object;
  };
}

async function responsibilities({ colleagueId }) {
  const responsibilities = await responsibilityFn.list({ colleagueId });

  return {
    role: "system",
    content: {
      responsibilities,
    },
  } as {
    role: "user" | "system" | "assistant";
    content: object;
  };
}

async function conversations({ sessionId }) {
  const conversations = await session.listConversations({ sessionId });

  return conversations.map(({ role, content }) => ({
    role: role.toLowerCase(),
    content,
  }));
}

async function teamChat({
  content,
  teamId,
}: {
  content: string;
  teamId: string;
}) {
  const context = await messages({ teamId });

  const next = await generate({
    dataset: dataset.train.teamChat,
    context,
    content,
    json_format:
      "{ resource: <RESOURCE>, function: <FUNCTION>, parameters: <PARAMETERS> }",
  });

  let data;

  if (next.resource && next.function && next.parameters) {
    try {
      const resource = require(`./${next.resource}`).default;
      data = await resource[next.function]({ ...next.parameters, teamId });
    } catch (err) {
      console.error(err);
    }
  }

  const { response } = await generate({
    context,
    content:
      next.resource && next.function && next.parameters
        ? `${next.resource}.${next.function}(${JSON.stringify(
            next.parameters
          )})=${JSON.stringify(data)} ${content}`
        : content,
    json_format: "{ response: <RESPONSE> }",
  });

  await message.create({
    role: "ASSISTANT",
    content: typeof response === "object" ? JSON.stringify(response) : response,
    teamId,
  });
}

async function task({ taskId }: { taskId: string }) {
  const { colleagueId, description } = await taskFn.get({ taskId });
  const currentTask = {
    description,
    steps: await taskFn.listSteps({ taskId }),
  };

  if (currentTask.steps.length > 10) {
    return await taskFn.update({
      taskId,
      status: "FAILED",
      comment: "Failed due to too many steps",
    });
  }

  const context = [
    ...(
      await Promise.all([
        info({ colleagueId }),
        knowledge({ colleagueId, taskId }),
        responsibilities({ colleagueId }),
      ])
    ).flat(),
    actions.list(),
  ];

  const {
    next_step: { action, parameters, comment },
  } = await generate({
    dataset: dataset.train.task,
    context,
    content: currentTask,
    json_format:
      "{ next_step: { action: <ACTION>, parameters: <PARAMETER>, comment: <COMMENT> } }",
  });

  if (action === "PLATFORM:complete") {
    const steps = await taskFn.listSteps({ taskId });

    let result;

    if (steps.length) {
      result = steps[steps.length - 1].result;
    }

    return await taskFn.update({
      taskId,
      result,
      comment,
      status: "COMPLETED",
    });
  }

  await taskFn.addStep({
    taskId,
    action,
    parameters,
    comment,
  });
}

async function step({
  stepId,
  action,
  parameters,
  comment,
}: {
  stepId: string;
  action: string;
  parameters: object;
  comment: string;
}) {
  let actionType;

  if (Integrations.find((integration) => integration.action === action)) {
    actionType = "MCP";
  } else if (action === "SUPERVISED") {
    actionType = "SUPERVISED";
  } else {
    actionType = "ACTION";
  }

  try {
    let actionFn;
    let result;
    let mcpClient;

    if (action === "SUPERVISED") {
      actionFn = require("../actions/supervised").default;
    } else if (actionType === "ACTION") {
      // @ts-ignore
      const { lib } = actions.find(action);
      actionFn = require(`../actions/${lib}`).default;
    } else if (actionType === "MCP") {
      const mcp = require("../lib/mcp").default;

      const provider = action.split(":")[0].toLowerCase();
      const tool = action.split(":")[1];

      mcpClient = await mcp.connect({ name: provider, tool });
    }

    if (actionType === "ACTION" || actionType === "SUPERVISED") {
      const { taskId } = await taskFn.getStep({ stepId });
      const steps = await taskFn.listSteps({ taskId });

      result = await actionFn.run({
        context: steps
          .filter((step) => step.result)
          .map(
            ({ comment, result }) => `Comment: ${comment}\nResult: ${result}`
          )
          .join("\n"),
        parameters,
      });
    } else if (actionType === "MCP") {
      result = await mcpClient.callTool(action, parameters);
    }

    let resultString;

    if (result && typeof result === "object") {
      resultString = JSON.stringify(result);
    } else {
      resultString = result;
    }

    await taskFn.updateStep({
      stepId,
      result: resultString,
      status: "COMPLETED",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      await taskFn.updateStep({
        stepId,
        result: err.message,
        status: "FAILED",
      });
    }
  }
}

async function responsibility({
  history,
  content,
}: {
  history?: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  content: string;
}) {
  const response = await generate({
    dataset: dataset.train.responsibilityChat,
    context: history,
    content,
    json_format: "{ response: <RESPONSE>, flow: [<FLOW>] }",
  });

  return response;
}

async function responsibilityName({
  history,
  content,
}: {
  history?: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  content: string;
}) {
  const response = await generate({
    dataset: dataset.train.responsibilityName,
    context: history,
    content,
    json_format: "{ title: <TITLE>, description: <DESCRIPTION> }",
  });
  return response;
}

async function responsibilityToTask({
  history,
  content,
  knowledge,
  responsibility,
}: {
  history?: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  content: string;
  knowledge: Array<[]>;
  responsibility: object;
}) {
  const context = [
    {
      role: "system" as const,
      content: {
        responsibility,
        knowledge,
        history,
      },
    },
  ];

  const response = await generate({
    dataset: dataset.train.responsibility,
    context,
    content,
    json_format: "{ task: <TASK> ,answer: <ANSWER> }",
  });

  return response;
}

async function responsibilityDiamond({
  content,
  responsibilities,
}: {
  content: string;
  responsibilities: Array<[]>;
}) {
  const context = [
    {
      role: "system" as const,
      content: {
        responsibilities,
      },
    },
  ];

  const response = await generate({
    dataset: dataset.train.responsibilityDiamond,
    context,
    content,
    json_format:
      "{ decision: <DECISION>,existing: <EXISTING>,responsibilityId: <RESPONSIBILITY_ID> }",
  });
  return response;
}

async function chat({
  colleagueId,
  sessionId,
  content,
}: {
  colleagueId: string;
  sessionId: string;
  content: string;
}) {
  const knowledgeData = await knowledgeFn.list({
    colleagueId,
  });

  const conversationsData = await conversations({ sessionId });
  const responsibilitiesData = await responsibilityFn.list({ colleagueId });

  const responsibilityDecision = await responsibilityDiamond({
    content: content,
    responsibilities: responsibilitiesData,
  });

  if (responsibilityDecision.decision === "RESPONSIBILITY") {
    const responsibilityData = await responsibilityFn.get({
      responsibilityId: responsibilityDecision.responsibilityId,
    });

    const responsibilityToTaskResponse = await responsibilityToTask({
      history: conversationsData,
      knowledge: knowledgeData,
      content: content,
      responsibility: responsibilityData,
    });

    await taskFn.create({
      colleagueId,
      description: responsibilityToTaskResponse.task.description,
      responsibilityId: responsibilityDecision.responsibilityId,
    });

    await session.addConversation({
      sessionId,
      colleagueId,
      role: "ASSISTANT",
      content: responsibilityToTaskResponse.answer,
    });
  } else {
    const infoData = await info({ colleagueId });

    const context = [knowledgeData, conversationsData, infoData];

    const { evaluation } = await generate({
      dataset: dataset.train.chat,
      context,
      content,
      json_format: "{ evaluation: { is_answer_known: <true|false> } }",
    });

    if (evaluation.is_answer_known) {
      const { answer, confidence } = await generate({
        policy: dataset.policy,
        dataset: dataset.train.chat,
        context,
        content,
        json_format: "{ answer: <ANSWER_IN_NLP>, confidence: <0-1> }",
      });

      console.debug(answer, confidence);

      await session.addConversation({
        sessionId,
        colleagueId,
        role: "ASSISTANT",
        content: answer,
      });
    } else {
      const conversation = await session.addConversation({
        sessionId,
        colleagueId,
        role: "ASSISTANT",
        content: "Please wait while I am working on your request.",
      });

      await supervising.create({
        sessionId,
        conversationId: conversation.id,
        question: content,
        colleagueId,
      });
    }
  }
}

export default {
  teamChat,
  chat,
  task,
  step,
  responsibility,
  responsibilityName,
  responsibilityToTask,
  responsibilityDiamond,
};
