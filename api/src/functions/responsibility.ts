import { NotFoundError } from "@nucleoidai/platform-express/error";
import Responsibility from "../models/Responsibility";
import ResponsibilityNode from "../models/ResponsibilityNode";
import { v4 as uuidv4 } from "uuid";

type NodeType = {
  id: string;
  properties?: {
    label: string;
    icon: string;
  };
  type: string;
  responsibilityId?: string;
  dependencyId?: string | null;
};

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
  id: string,
  nodes?: NodeType[]
) {
  let responsibility;
  let createdNodes;

  const existingResponsibility = await Responsibility.findByPk(id);

  if (existingResponsibility) {
    if (nodes) {
      await ResponsibilityNode.destroy({
        where: { responsibilityId: id },
      });
    }

    await ResponsibilityNode.destroy({
      where: { responsibilityId: id },
    });

    await existingResponsibility.update({ title, description, colleagueId });

    responsibility = existingResponsibility;
  } else {
    responsibility = await Responsibility.create({
      id,
      title,
      description,
      colleagueId,
    });
  }

  if (nodes) {
    const idMap = new Map();
    const nodesToCreate = nodes.map((node: NodeType) => {
      const nodeUuid = uuidv4();
      idMap.set(node.id, nodeUuid);

      return {
        id: nodeUuid,
        type: "standard",
        properties: node.properties
          ? {
              label: node.properties.label,
              icon: node.properties.icon,
            }
          : {
              label: "",
              icon: "",
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

    createdNodes = await ResponsibilityNode.bulkCreate(nodesToCreate);
  }

  return {
    ...responsibility.toJSON(),
    Nodes: createdNodes,
  };
}

export default {
  getWithNodes,
  upsert,
};
