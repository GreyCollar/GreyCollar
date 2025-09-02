import Colleague from "../models/Colleague";
import Step from "../models/Step";
import Task from "../models/Task";
import { publish } from "@nucleoidai/node-event";

async function create({
  colleagueId,
  description,
  responsibilityId,
}: {
  colleagueId: string;
  description: string;
  responsibilityId?: string;
}) {
  const task = await Task.create({
    colleagueId,
    description,
    status: "IN_PROGRESS",
    responsibilityId,
  });

  publish("TASK", "CREATED", {
    taskId: task.id,
    colleagueId,
    description,
    responsibilityId,
  });

  return task;
}

async function update({
  taskId,
  result,
  comment,
  status,
}: {
  taskId: string;
  result?: string;
  comment?: string;
  status: "COMPLETED" | "FAILED";
}) {
  await Task.update({ result, comment, status }, { where: { id: taskId } });

  if (status === "COMPLETED") {
    publish("TASK", "COMPLETED", { taskId, result, comment });
  }
}

async function get({ taskId }: { taskId: string }) {
  const taskInstance = await Task.findOne({ where: { id: taskId } });
  return taskInstance.toJSON();
}

async function getWithSteps({ taskId }: { taskId: string }) {
  const taskInstance = await Task.findOne({
    where: { id: taskId },
    include: [Step],
  });

  return taskInstance.toJSON();
}

async function list({
  teamId,
  colleagueId,
  status,
}: {
  teamId: string;
  colleagueId?: string;
  status?: "IN_PROGRESS" | "COMPLETED" | "FAILED";
}) {
  const where: {
    colleagueId?: string;
    status?: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  } = {};

  if (colleagueId) {
    where.colleagueId = colleagueId;
  }

  if (status) {
    where.status = status;
  }

  const taskInstances = await Task.findAll({
    include: [
      {
        model: Colleague,
        attributes: [],
        where: { teamId },
        required: true,
      },
    ],
    where,
  });

  return taskInstances.map((task) => task.toJSON());
}

async function addStep({
  taskId,
  action,
  parameters,
  comment,
}: {
  taskId: string;
  action: string;
  parameters: object;
  comment: string;
}) {
  const step = await Step.create({
    taskId,
    action,
    parameters,
    comment,
  });

  publish("STEP", "ADDED", {
    stepId: step.id,
    taskId,
    action,
    parameters,
    comment,
  });

  return step.toJSON();
}

async function getStep({ stepId }: { stepId: string }) {
  const step = await Step.findOne({ where: { id: stepId } });
  return step.toJSON();
}

async function updateStep({
  stepId,
  result,
  status,
}: {
  stepId: string;
  result: string;
  status: "IN_PROGRESS" | "SUPERVISED_NEEDED" | "COMPLETED" | "FAILED";
}) {
  const { taskId, action, parameters } = await Step.findOne({
    where: { id: stepId },
  });
  const step = await Step.update(
    {
      result,
      status,
    },
    { where: { id: stepId } }
  );

  if (status === "COMPLETED") {
    publish("STEP", "COMPLETED", {
      taskId,
      stepId,
      action,
      parameters,
      result,
    });
  }

  return step;
}

async function listSteps({ taskId }: { taskId: string }) {
  const steps = await Step.findAll({
    where: { taskId },
  });

  return steps
    .map((step) => step.toJSON())
    .map((step) => ({
      ...step,
      result: step.result ? step.result.toString() : null,
    }));
}

export default {
  create,
  get,
  update,
  list,
  getStep,
  addStep,
  updateStep,
  listSteps,
};
