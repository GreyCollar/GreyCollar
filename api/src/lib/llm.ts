import anthropic from "./anthropic";
import azure from "./azure";
import openai from "./openai";

let llm;

if (process.env.PLATFORM_LLM === "OPENAI") {
  llm = openai;
}

if (process.env.PLATFORM_LLM === "AZURE") {
  llm = azure;
}

if (process.env.PLATFORM_LLM === "ANTHROPIC") {
  llm = anthropic;
}

async function generate({
  model,
  dataset,
  policy,
  context = [],
  content,
  json_format,
  temperature = 0,
  max_tokens,
}: {
  model?: string;
  policy?: {
    role: "system";
    content: string;
  };
  dataset?: {
    role: "system";
    content: string;
  };
  context?: {
    role: "user" | "system" | "assistant";
    content: string | object | object[];
  }[];
  content: string | object;
  json_format: string;
  temperature?: number;
  max_tokens?: number;
}) {
  const messages = [
    ...context.map(({ role, content }) => ({
      role,
      content: JSON.stringify(content),
    })),
    { role: "user", content: JSON.stringify(content) },
    {
      role: "system",
      content: `json_format: ${json_format}`,
    },
  ].map(({ role, content }) => ({
    role,
    content: JSON.stringify(content),
  }));

  if (dataset) {
    messages.unshift(dataset);
  }

  if (policy) {
    messages.unshift(policy);
  }

  return await llm.generate({
    model,
    messages,
    temperature,
    max_tokens,
  });
}

export { generate };

