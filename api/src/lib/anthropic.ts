import { Anthropic } from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages.mjs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generate({
  model = "claude-3-5-sonnet-20241022",
  messages = [],
  temperature = 0,
  max_tokens = 2048,
}: {
  model?: string;
  messages?: { role: "user" | "assistant" | "system"; content: string }[];
  temperature?: number;
  max_tokens?: number;
}) {
  const systemMessages = messages.filter((msg) => msg.role === "system");
  const conversationMessages = messages.filter((msg) => msg.role !== "system");

  let systemPrompt =
    systemMessages.length > 0
      ? systemMessages.map((msg) => msg.content).join("\n\n")
      : undefined;

  // TODO: Find a better way to handle json_output enforcement for Claude responses.
  const lastSystemMsg = systemMessages[systemMessages.length - 1];
  if (lastSystemMsg && lastSystemMsg.content.includes("json_format:")) {
    systemPrompt =
      systemPrompt +
      "\n\nIMPORTANT: You MUST respond with ONLY valid JSON that matches the format specified. Do NOT include any text before or after the JSON. Do NOT wrap the JSON in markdown code blocks. Output ONLY the raw JSON object.";
  }

  const params = {
    model,
    messages: conversationMessages as MessageParam[],
    temperature,
    max_tokens,
    ...(systemPrompt && { system: systemPrompt }),
  };

  const { usage, content } = await anthropic.messages.create(params);

  if (usage) {
    const { input_tokens, output_tokens } = usage;
    console.info({ input_tokens, output_tokens });
  }

  if (content) {
    const textContent = content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(textContent);
  } else {
    throw new Error("Claude is not responding");
  }
}

export default { generate };
