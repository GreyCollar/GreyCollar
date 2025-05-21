import Communication from "../models/Communication";
import { NotFoundError } from "@nucleoidai/platform-express/error";

async function list() {
  const communications = await Communication.findAll();

  return communications.map((communication) => communication.toJSON());
}

async function create({
  channelType,
  channelCode,
  responsibilityId,
}: {
  channelType: string;
  channelCode: string;
  responsibilityId: string;
}) {
  const communication = await Communication.create({
    channelType,
    channelCode,
    responsibilityId,
  });

  return communication.toJSON();
}

async function get({ communicationId }: { communicationId: string }) {
  const communication = await Communication.findByPk(communicationId);

  if (!communication) {
    throw new NotFoundError();
  }

  return communication.toJSON();
}

async function remove({ communicationId }: { communicationId: string }) {
  const deleted = await Communication.destroy({
    where: { id: communicationId },
  });

  if (!deleted) {
    throw new NotFoundError();
  }

  return true;
}

export default { list, create, get, remove };
