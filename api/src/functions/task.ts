import Colleague from "../models/Colleague";
import Step from "../models/Step";
import Task from "../models/Task";
import { event } from "node-event-test-package/client";

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

  await event.publish("TASK_CREATED", {
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
    await event.publish("TASK_COMPLETED", { taskId, result, comment });
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

  await event.publish("STEP_ADDED", {
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
  const stepInstance = await Step.findOne({
    where: { id: stepId },
  });

  if (!stepInstance) {
    throw new Error(`Step not found: ${stepId}`);
  }

  const { taskId, action, parameters } = stepInstance.toJSON();

  stepInstance.result = result;
  stepInstance.status = status;
  await stepInstance.save();

  if (status === "COMPLETED") {
    await event.publish("STEP_COMPLETED", {
      taskId,
      stepId,
      action,
      parameters,
      result,
    });
  }

  return stepInstance.toJSON();
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
