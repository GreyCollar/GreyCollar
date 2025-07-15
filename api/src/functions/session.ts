import Conversation from "../models/Conversation";
import Session from "../models/Session";
import { nodeEvent } from "nuc-node-event-test/client";
import { publish } from "../lib/Event";
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

  publish("SESSION", "INITIATED", {
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
    publish("SESSION", "USER_MESSAGED", {
      colleagueId,
      sessionId,
      conversationId: conversation.id,
      content,
    });
  } else {
    nodeEvent.publish("AI_MESSAGED", {
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
