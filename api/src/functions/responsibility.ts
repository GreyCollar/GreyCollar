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

async function createResponsibility(title, description, colleagueId) {
  if (!title || !description || !colleagueId) {
    throw new Error("Title, description and colleagueId are required");
  }

  const responsibility = await Responsibility.create({
    title,
    description,
    colleagueId,
  });

  return responsibility;
}

type NodeType = {
  id: string;
  label: string;
  icon: string;
  dependencyId?: string;
};

async function connectResponsibilityWithNodes(
  responsibilityId,
  nodes: NodeType[] = []
) {
  if (!responsibilityId) {
    throw new Error("ResponsibilityId is required");
  }

  const idMap = new Map();
  let createdNodes = [];

  const nodesToCreate = nodes.map((node: NodeType) => {
    const nodeUuid = uuidv4();
    idMap.set(node.id, nodeUuid);

    return {
      id: nodeUuid,
      type: "standard",
      properties: {
        label: node.label,
        icon: node.icon,
      },
      responsibilityId,
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

  createdNodes = await ResponsibilityNode.bulkCreate(nodesToCreate);
  return createdNodes;
}

export default {
  getWithNodes,
  createResponsibility,
  connectResponsibilityWithNodes,
};
