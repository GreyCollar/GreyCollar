import { z } from "zod";

const ConditionNode = z.object({
  id: z.string().uuid(),
  type: z.literal("CONDITION").describe("Condition node"),
  true: z.array(z.string().uuid()).nullable().describe("True node id"),
  false: z.array(z.string().uuid()).nullable().describe("False node id"),
  properties: z.object({
    label: z.string(),
    icon: z.string(),
  }),
});

const NormalNode = z.object({
  id: z.string().uuid(),
  type: z.literal("NORMAL").describe("Normal node"),
  next: z.array(z.string().uuid()).nullable().describe("Next node id"),
  properties: z.object({
    label: z.string(),
    icon: z.string(),
  }),
});

const Node = z.discriminatedUnion("type", [ConditionNode, NormalNode]);

export default Node;
