import { NotFoundError } from "@canmingir/link-express/error";
import Responsibility from "../models/Responsibility";

type NodeType = {
  id: string;
  properties?: {
    label: string;
    icon: string;
  };
  type: string;
  next?: string[] | null;
};

async function getWithNodes(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }

  const responsibility = await Responsibility.findOne({
    where: {
      id,
    },
  });

  if (!responsibility) {
    throw new NotFoundError();
  }

  return responsibility.toJSON();
}

async function upsert(
  title: string,
  description: string,
  colleagueId: string,
  id: string,
  nodes?: NodeType[]
) {
  let responsibility;

  const existingResponsibility = await Responsibility.findByPk(id);

  if (existingResponsibility) {
    await existingResponsibility.update({
      title,
      description,
      colleagueId,
      nodes: nodes || null,
    });

    responsibility = existingResponsibility;
  } else {
    responsibility = await Responsibility.create({
      id,
      title,
      description,
      colleagueId,
      nodes: nodes || null,
    });
  }

  return {
    ...responsibility.toJSON(),
    Nodes: nodes || [],
  };
}

async function remove({ responsibilityId }: { responsibilityId: string }) {
  await Responsibility.destroy({
    where: { id: responsibilityId },
  });
}

async function list({ colleagueId }: { colleagueId: string }) {
  const responsibilities = await Responsibility.findAll({
    where: { colleagueId },
  });

  return responsibilities.map((responsibility) => responsibility.toJSON());
}

async function get({ responsibilityId }: { responsibilityId: string }) {
  const responsibility = await Responsibility.findByPk(responsibilityId);

  if (!responsibility) {
    throw new NotFoundError();
  }

  return responsibility.toJSON();
}

export default {
  getWithNodes,
  upsert,
  remove,
  list,
  get,
};
