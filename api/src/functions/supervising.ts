import ColleagueKnowledge from "../models/ColleagueKnowledge";
import Knowledge from "../models/Knowledge";
import Supervising from "../models/Supervising";
import { event } from "@nucleoidai/node-event/client";

async function create({
  sessionId,
  conversationId,
  question,
  colleagueId,
}: {
  sessionId: string;
  conversationId: string;
  question: string;
  colleagueId: string;
}) {
  const supervising = await Supervising.create({
    sessionId,
    conversationId,
    question,
    colleagueId,
  });

  await event.publish("SUPERVISING.RAISED", {
    sessionId,
    conversationId,
    question,
    colleagueId,
  });

  return supervising;
}

async function update({
  teamId,
  supervisingId,
  colleagueId,
  question,
  answer,
  status,
}: {
  teamId: string;
  supervisingId: string;
  status: "ANSWERED";
  colleagueId: string;
  question: string;
  answer: string;
}) {
  await Supervising.update(
    { status, answer },
    { where: { id: supervisingId } }
  );

  const updatedSupervising = await Supervising.findByPk(supervisingId);
  const { sessionId, conversationId } = updatedSupervising;

  const knowledgeInstance = await Knowledge.create({
    type: "QA",
    question,
    answer,
    colleagueId,
  });
  await ColleagueKnowledge.create({
    knowledgeId: knowledgeInstance.id,
    colleagueId,
    teamId,
  });

  await event.publish("SUPERVISING.ANSWERED", {
    teamId,
    supervisingId,
    sessionId,
    conversationId,
    colleagueId,
    question,
    answer,
    status,
  });

  return updatedSupervising;
}

export default { create, update };
