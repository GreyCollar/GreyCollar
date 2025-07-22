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
          "1//0313cXAPxW8ozCgYIARAAGAMSNwF-L9IrCeSNrvBKzLjlXXoSFpUQyHFBX3AXBG36j7pSR3uD32BEx3cvWICQV1RJKXj2x2z3q9o",
      },
    });
    const tools = await mcpClient.listTools();
    console.log(JSON.stringify(tools, null, 2));
    const res = await mcpClient.callTool("GDRIVE:search", {
      query: "Call" as string,
    });
    console.log(res);
    return mcpClient;
  } finally {
    await mcpClient.close();
  }
}

export default { connect };

