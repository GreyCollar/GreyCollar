let llm;

if (process.env.PLATFORM_LLM === "OPENAI") {
  llm = require("../lib/openai").default;
}

if (process.env.PLATFORM_LLM === "AZURE") {
  llm = require("../lib/azure").default;
}
if (process.env.PLATFORM_LLM === "ANTHROPIC") {
  llm = require("../lib/anthropic").default;
}

async function run({ context, parameters: { message } }) {
  let userContent = "";

  if (context) {
    const contextStr =
      typeof context === "string" ? context : JSON.stringify(context, null, 2);
    if (contextStr.trim() !== "") {
      userContent = `Context from previous steps:\n${contextStr}\n\n`;
    }
  }

  const messageStr =
    typeof message === "string" ? message : JSON.stringify(message);
  userContent += `Task: ${messageStr}`;

  const { result } = await llm.generate({
    messages: [
      {
        role: "system",
        content: "json_format: { result: <RESULT_IN_NLP> }",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  return result;
}

export default { run };
