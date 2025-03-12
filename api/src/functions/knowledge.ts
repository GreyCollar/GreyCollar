import Colleague from "../models/Colleague";
import ColleagueKnowledge from "../models/ColleagueKnowledge";
import Knowledge from "../models/Knowledge";
import { NotFoundError } from "@nucleoidai/platform-express/error";
import { Op } from "sequelize";
import Step from "../models/Step";
import Task from "../models/Task";
import scrapper from "../actions/scrapper";
async function create({
  teamId,
  colleagueId,
  knowledge,
}: {
  teamId?: string;
  colleagueId?: string;
  knowledge: {
    type: "QA" | "URL" | "TEXT" | "TASK";
    url?: string;
    text?: string;
    question?: string;
    answer?: string;
    content?: string;
    taskId?: string;
  };
}) {
  if (!teamId && !colleagueId) {
    throw new Error("INVALID_TEAM_OR_COLLEAGUE");
  }

  if (knowledge.type === "QA" && (!knowledge.question || !knowledge.answer)) {
    throw new Error("INVALID_QA_KNOWLEDGE");
  }

  if (knowledge.type === "URL" && !knowledge.url && knowledge.content) {
    throw new Error("INVALID_URL_KNOWLEDGE");
  }

  if (knowledge.type === "TEXT" && !knowledge.text) {
    throw new Error("INVALID_TEXT_KNOWLEDGE");
  }

  if (knowledge.type === "URL" && knowledge.url) {
    knowledge.content = await scrapper.run({
      parameters: { url: knowledge.url },
    });
  }

  if (knowledge.type === "TASK" && !knowledge.taskId) {
    throw new Error("INVALID_TASK_KNOWLEDGE");
  }

  if (knowledge.type === "TASK") {
    const taskKnowledgeInstance = await Knowledge.findOne({
      where: {
        type: "TASK",
        taskId: knowledge.taskId,
      },
    });

    if (taskKnowledgeInstance) {
      return taskKnowledgeInstance.toJSON();
    }
  }

  const knowledgeInstance = await Knowledge.create(knowledge);
  await ColleagueKnowledge.create({
    knowledgeId: knowledgeInstance.id,
    colleagueId,
    teamId,
  });

  return knowledgeInstance;
}

async function list({
  colleagueId,
  teamId,
  type,
  options = { includeSteps: false },
}: {
  teamId?: string;
  colleagueId?: string;
  type?: string;
  options?: { includeSteps?: boolean };
}) {
  if ((colleagueId && teamId) || (!colleagueId && !teamId)) {
    throw new Error("INVALID_QUERY_KNOWLEDGE");
  }

  const typeWhere = {} as {
    type?: string;
  };

  if (type) {
    typeWhere.type = type;
  }

  const knowledgeWhere: {
    colleagueId?: string;
    teamId?: string;
  }[] = [];

  if (colleagueId) {
    const colleagueInstance = await Colleague.findByPk(colleagueId);

    if (!colleagueInstance) {
      throw new Error("INVALID_COLLEAGUE");
    }

    const teamId = colleagueInstance.toJSON().teamId;

    knowledgeWhere.push({ colleagueId });
    knowledgeWhere.push({ teamId });
  }

  if (teamId) {
    knowledgeWhere.push({ teamId });
  }

  const knowledgeInstances = await Knowledge.findAll({
    where: typeWhere,
    include: [
      {
        model: ColleagueKnowledge,
        where: {
          [Op.or]: knowledgeWhere,
        },
      },
      {
        model: Task,
        required: false,
        include: options.includeSteps
          ? {
              model: Step,
              as: "steps",
            }
          : [],
      },
    ],
  });

  return knowledgeInstances
    .map((knowledge) => knowledge.toJSON())
    .map(({ ColleagueKnowledge, ...knowledgeData }) => ({
      ...knowledgeData,
      colleagueId: ColleagueKnowledge.colleagueId
        ? ColleagueKnowledge.colleagueId
        : null,
      teamId: ColleagueKnowledge.teamId ? ColleagueKnowledge.teamId : null,
      Task: knowledgeData.Task && {
        ...knowledgeData.Task,
        steps:
          knowledgeData.Task.steps &&
          knowledgeData.Task.steps.map((step) => ({
            ...step,
            result: step.result && step.result.toString(),
          })),
      },
    }));
}

async function get({
  knowledgeId,
  includeColleague = false,
}: {
  knowledgeId: string;
  includeColleague?: boolean;
}) {
  const includeOptions: {
    model: typeof ColleagueKnowledge;
    attributes: string[];
    include: {
      model: typeof Colleague;
      attributes: string[];
    }[];
  }[] = [];

  if (includeColleague) {
    includeOptions.push({
      model: ColleagueKnowledge,
      attributes: ["teamId", "colleagueId"],
      include: [
        {
          model: Colleague,
          attributes: ["id", "teamId"],
        },
      ],
    });
  }

  const knowledgeItem = await Knowledge.findByPk(knowledgeId, {
    include: includeOptions,
  });

  if (!knowledgeItem) {
    throw new NotFoundError();
  }

  return knowledgeItem.toJSON();
}

export default { create, list, get };
