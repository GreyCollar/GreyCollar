import McpClient from "../../../mcp/McpClient";

async function connect() {
  const mcpClient = new McpClient({ name: "gdrive", version: "1.0.0" });
  try {
    await mcpClient.connectToServer({
      credentials: {
        clientId: process.env.GDRIVE_CLIENT_ID as string,
        clientSecret: process.env.GDRIVE_CLIENT_SECRET as string,
        redirectUris: [process.env.GDRIVE_REDIRECT_URI as string],
        refreshToken: process.env.GDRIVE_REFRESH_TOKEN as string,
      },
    });
    return mcpClient;
  } finally {
    await mcpClient.close();
  }
}

export default { connect };
