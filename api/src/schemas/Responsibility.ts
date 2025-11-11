import { z } from "zod";

const Responsibility = {
  upsert: z.object({
    title: z.string(),
    description: z.string(),
    colleagueId: z.string().uuid(),
    nodes: z
      .array(
        z.object({
          id: z.string(),
          properties: z
            .object({
              label: z.string(),
              icon: z.string(),
            })
            .optional(),
          type: z.string(),
          next: z.array(z.string()).nullish(),
          true: z.array(z.string()).nullish(),
          false: z.array(z.string()).nullish(),
        })
      )
      .optional(),
  }),
  create: z.object({
    history: z
      .array(
        z.object({
          role: z.enum(["user", "system", "assistant"]),
          content: z.string(),
        })
      )
      .optional(),
    content: z.string(),
  }),
  createResponsibilityName: z.object({
    history: z.array(
      z.object({
        role: z.enum(["user", "system", "assistant"]),
        content: z.string(),
      })
    ),
    content: z.string(),
  }),
  delete: z.object({
    colleagueId: z.string().uuid(),
  }),
};

export default Responsibility;
