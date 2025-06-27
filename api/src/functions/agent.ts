import actions from "../actions";
import colleague from "./colleague";
import dataset from "../dataset";
import { generate } from "../lib/llm";
import knowledgeFn from "./knowledge";
import message from "./message";
import messagesFunc from "./message";
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

async function chat({
  colleagueId,
  sessionId,
  conversationId,
  content,
}: {
  colleagueId: string;
  sessionId: string;
  conversationId: string;
  content: string;
}) {
  const context = [
    ...(
      await Promise.all([
        info({ colleagueId }),
        knowledge({ colleagueId }),
        conversations({ sessionId }),
      ])
    ).flat(),
  ];

  const { evaluation } = await generate({
    dataset: dataset.train.chat,
    context,
    content,
    json_format: "{ evaluation: { is_answer_known: <true|false> } }",
    // Experimental Fields
    // json_format: `
    //     {
    //       evaluation: {
    //         is_answer_known: <true|false>,
    //         complies_with_policy: <true|false>,
    //         confidence_score: <0.0-1.0>,
    //         requires_human_intervention: <true|false>,
    //         response_type: <factual|opinion|instructional>,
    //         additional_notes: <string>,
    //         question_analysis: {
    //           category: <general_knowledge|HR_policy|technical|other>,
    //           complexity_level: <low|medium|high>,
    //           contains_sensitive_information: <true|false>,
    //           contains_prohibited_content: <true|false>
    //         },
    //         security: {
    //           is_safe_to_answer: <true|false>,
    //           data_privacy_risk: <low|medium|high>,
    //           potential_phishing_attempt: <true|false>
    //         },
    //         sentiment_analysis: {
    //           question_sentiment: <positive|neutral|negative>,
    //           toxicity_level: <none|low|medium|high>,
    //           user_frustration_detected: <true|false>
    //         },
    //         context: {
    //           previous_questions_context: <true|false>,
    //           user_role: <employee|manager|customer|other>,
    //           department: <engineering|HR|sales|other>,
    //           geolocation_restricted: <true|false>,
    //           requires_escalation: <true|false>
    //         },
    //         response_metadata: {
    //           source: <internal_knowledge_base|external_API|predefined_response>,
    //           response_format: <text|JSON|multimedia>,
    //           alternative_sources_available: <true|false>,
    //           fallback_strategy: <redirect_to_human|use_predefined_answer|other>
    //         }
    //       }
    //     }`,
  });

  console.debug(evaluation);

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

  if (action === "COMPLETE") {
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

async function step({ stepId, action, parameters }) {
  try {
    let actionFn;

    if (action === "SUPERVISED") {
      actionFn = require("../actions/supervised").default;
    } else {
      // @ts-ignore
      const { lib } = actions.find(action);
      actionFn = require(`../actions/${lib}`).default;
    }

    const { taskId } = await taskFn.getStep({ stepId });
    const steps = await taskFn.listSteps({ taskId });

    const result = await actionFn.run({
      context: steps
        .filter((step) => step.result)
        .map(({ comment, result }) => `Comment: ${comment}\nResult: ${result}`)
        .join("\n"),
      parameters,
    });

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
    dataset: dataset.train.responsibility,
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

export default {
  teamChat,
  chat,
  task,
  step,
  responsibility,
  responsibilityName,
};
