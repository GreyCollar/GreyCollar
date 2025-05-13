import azure from "./azure";
import openai from "./openai";

let llm;

if (process.env.PLATFORM_LLM === "OPENAI") {
  llm = openai;
}

if (process.env.PLATFORM_LLM === "AZURE") {
  llm = azure;
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

  console.log("messages", messages);
  console.log("llm", llm);

  return await llm.generate({
    model,
    messages,
    temperature,
    max_tokens,
  });
}

async function generateNode({
  dataset,
  content,
  json_format,
  flow,
}: {
  dataset?: { role: string; content: string };
  json_format: string;
  content: { role: string; content: string; text?: string }[];
  flow: [];
}) {
  const messages: {
    role: string;
    content?: string;
    text?: string;
    flow?: [];
  }[] = [];

  console.log(content);
  console.log(flow);

  if (dataset) {
    messages.push({ role: dataset.role, content: dataset.content });
  }

  if (content.length > 1) {
    content.forEach((message) => {
      messages.push({
        role: message.role === "ai" ? "assistant" : message.role,
        content: message?.content || message?.text,
      });
    });
  }

  if (flow) {
    messages.push({
      role: "system",
      content: JSON.stringify(flow),
    });
  }

  messages.push({
    role: "user",
    content: typeof content === "object" ? JSON.stringify(content) : content,
  });

  messages.push({
    role: "system",
    content: `json_format: ${json_format}`,
  });

  const response = await llm.generate({ messages });

  const text = Array.isArray(response.choices)
    ? response.choices[0].message.content
    : typeof response === "string"
    ? response
    : JSON.stringify(response);

  try {
    const parsed = JSON.parse(text);
    console.log("flow", parsed?.flow);
    console.log("response", parsed?.response);

    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON:\n", text);
    throw err;
  }
}

export { generate, generateNode };

