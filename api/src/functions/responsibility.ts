import { NotFoundError } from "@nucleoidai/platform-express/error";
import Responsibility from "../models/Responsibility";
import ResponsibilityNode from "../models/ResponsibilityNode";
import { v4 as uuidv4 } from "uuid";

async function getWithNodes(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }

  const responsibility = await Responsibility.findOne({
    where: {
      id,
    },
    include: [
      {
        model: ResponsibilityNode,
        as: "Nodes",
      },
    ],
  });

  if (!responsibility) {
    throw new NotFoundError();
  }

  return responsibility.toJSON();
}

type NodeType = {
  id: string;
  properties: {
    label: string;
    icon: string;
  };
  type: string;
  responsibilityId?: string;
  dependencyId?: string;
};

async function upsert(
  title: string,
  description: string,
  colleagueId: string,
  nodes: NodeType[] = [],
  id?: string
) {

  let responsibility;

  if (id) {
    const existingResponsibility = await Responsibility.findByPk(id);

    if (!existingResponsibility) {
      throw new NotFoundError();
    }

    await ResponsibilityNode.destroy({
      where: { responsibilityId: id },
    });

    await existingResponsibility.update({ title, description, colleagueId });

    responsibility = existingResponsibility;
  } else {
    responsibility = await Responsibility.create({
      title,
      description,
      colleagueId,
    });
  }

  const idMap = new Map();
  const nodesToCreate = nodes.map((node: NodeType) => {
    const nodeUuid = uuidv4();
    idMap.set(node.id, nodeUuid);

    return {
      id: nodeUuid,
      type: "standard",
      properties: {
        label: node.properties.label,
        icon: node.properties.icon,
      },
      responsibilityId: responsibility.id,
      dependencyId: null,
    };
  });

  nodesToCreate.forEach((node) => {
    const originalNode = nodes.find(
      (n: NodeType) => idMap.get(n.id) === node.id
    );

    if (originalNode && originalNode.dependencyId) {
      node.dependencyId = idMap.get(originalNode.dependencyId);
    }
  });

  const createdNodes = await ResponsibilityNode.bulkCreate(nodesToCreate);

  return {
    ...responsibility.toJSON(),
    Nodes: createdNodes,
  };
}

export default {
  getWithNodes,
  upsert,
};
