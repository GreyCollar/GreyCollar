import Conversation from "../models/Conversation";
import Session from "../models/Session";
import { event } from "@nucleoidai/node-event/client";
import { v4 as uuid } from "uuid";

async function create({
  type,
  colleagueId,
}: {
  type: string;
  colleagueId: string;
}) {
  const sessionId = uuid();

  const session = await Session.create({
    id: sessionId,
    type,
    colleagueId,
  });

  await event.publish("SESSION_INITIATED", {
    id: sessionId,
    type,
    colleagueId,
  });

  return session;
}

async function addConversation({
  sessionId,
  role,
  colleagueId,
  content,
}: {
  sessionId: string;
  colleagueId: string;
  role: string;
  content: string;
}) {
  const session = await Session.findByPk(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const conversation = await Conversation.create({
    content,
    role,
    sessionId,
  });

  if (role === "USER") {
    await event.publish("SESSION_USER_MESSAGED", {
      colleagueId,
      sessionId,
      conversationId: conversation.id,
      content,
    });
  } else {
    await event.publish("SESSION_AI_MESSAGED", {
      colleagueId,
      sessionId,
      conversationId: conversation.id,
      content,
    });
  }

  return conversation;
}

async function listConversations({ sessionId }: { sessionId: string }) {
  return await Conversation.findAll({
    where: { sessionId },
    order: [["createdAt", "ASC"]],
  });
}

export default {
  create,
  addConversation,
  listConversations,
};
