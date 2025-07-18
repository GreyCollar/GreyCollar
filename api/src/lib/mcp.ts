import McpClient from "../../../mcp/McpClient";

async function connect() {
  const mcpClient = new McpClient({
    name: "gdrive",
    tool: "search",
    version: "1.0.0",
  });

  try {
    await mcpClient.connectToServer({
      credentials: {
        clientId: process.env.GDRIVE_CLIENT_ID as string,
        clientSecret: process.env.GDRIVE_CLIENT_SECRET as string,
        redirectUris: [process.env.GDRIVE_REDIRECT_URI as string],
        refreshToken:
          "1//03WcLLAuwVp24CgYIARAAGAMSNwF-L9Ir78hwtFCjLCouuHj-zfQmeULNRuh2NZGG4ZRvqEm8X052lVYiPq6Wd-zdXa2xChEJaHg",
      },
    });
    const tools = await mcpClient.listTools();
    console.log(JSON.stringify(tools, null, 2));
    const res = await mcpClient.callTool("GDRIVE:search", {
      query: "test",
    });
    console.log(res);
    return mcpClient;
  } finally {
    await mcpClient.close();
  }
}

export default { connect };

