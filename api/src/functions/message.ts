import Colleague from "../models/Colleague";
import ColleagueKnowledge from "../models/ColleagueKnowledge";
import Knowledge from "../models/Knowledge";
import Message from "../models/Message";
import { Op } from "sequelize";
import Supervising from "../models/Supervising";
import Task from "../models/Task";
import { publish } from "@nucleoidai/node-event";

async function create({
  role,
  colleagueId,
  content,
  userId,
  command,
  knowledgeId,
  teamId,
  replyTo,
}: {
  role: string;
  colleagueId?: string;
  content?: string;
  userId?: string;
  command?: string;
  knowledgeId?: string;
  teamId: string;
  replyTo?: string;
}) {
  const messageInstance = await Message.create({
    role,
    colleagueId,
    content,
    userId,
    command,
    knowledgeId,
    teamId,
    replyTo,
  });

  if (role === "USER") {
    publish("MESSAGE", "USER_MESSAGED", messageInstance.toJSON());
  }

  if (role === "ASSISTANT") {
    publish("MESSAGE", "ASSISTANT_MESSAGED", messageInstance.toJSON());
  }

  return messageInstance.toJSON();
}

async function listMessages({
  teamId,
  offset,
  limit = 50,
}: {
  teamId: string;
  offset?: string;
  limit?: number;
}) {
  const where = {
    teamId,
  } as {
    teamId: string;
    createdAt?: {
      [Op.gt]: Date;
    };
  };

  if (offset) {
    const date = new Date(offset);

    where.createdAt = {
      [Op.gt]: date,
    };
  }

  const messageInstances = await Message.findAll({
    where,
    order: [["createdAt", "ASC"]],
    limit,
  });

  return messageInstances.map((messageInstance) => messageInstance.toJSON());
}

async function list({
  teamId,
  offset,
  limit = 50,
}: {
  teamId: string;
  offset?: string;
  limit?: number;
}) {
  const where = {
    teamId,
  } as {
    teamId: string;
    createdAt?: {
      [Op.gt]: Date;
    };
  };

  if (offset) {
    const date = new Date(offset);

    where.createdAt = {
      [Op.gt]: date,
    };
  }

  const messagePromise = Message.findAll({
    where,
    order: [["createdAt", "ASC"]],
    limit,
  });

  const supervisingPromise = Supervising.findAll({
    include: [
      {
        model: Colleague,
        where: { teamId },
        attributes: [],
      },
    ],
  });

  const taskPromise = Task.findAll({
    include: [
      {
        model: Colleague,
        attributes: [],
        where: { teamId },
        required: true,
      },
    ],
  });

  const knowledgePromise = Knowledge.findAll({
    include: [
      {
        model: ColleagueKnowledge,
        where: { teamId },
      },
    ],
  });

  const [messages, supervisings, tasks, knowledges] = await Promise.all([
    messagePromise,
    supervisingPromise,
    taskPromise,
    knowledgePromise,
  ]);

  const result = [
    ...messages.map((message) => {
      const messageJson = message.toJSON();
      return {
        ...messageJson,
        createdAt: messageJson.createdAt.toISOString(),
      };
    }),
    ...supervisings.map((supervising) => {
      const supervisingJson = supervising.toJSON();
      return {
        mode: "SUPERVISING",
        role: "SYSTEM",
        ...supervisingJson,
        createdAt: supervisingJson.createdAt.toISOString(),
      };
    }),
    ...tasks.map((task) => {
      const taskJson = task.toJSON();
      return {
        mode: "TASK",
        role: "SYSTEM",
        ...taskJson,
        createdAt: taskJson.createdAt.toISOString(),
      };
    }),
    ...knowledges.map((knowledge) => {
      const knowledgeJson = knowledge.toJSON();
      return {
        mode: "KNOWLEDGE",
        role: "SYSTEM",
        ...knowledgeJson,
        createdAt: knowledgeJson.createdAt.toISOString(),
      };
    }),
  ];

  publish("MESSAGES_LOADED", result);

  return result;
}

export default { create, list, listMessages };
