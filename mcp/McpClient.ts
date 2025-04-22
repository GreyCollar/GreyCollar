import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

class McpClient {
  private name: string;
  private version: string;
  private mcp: Client;
  private transport!: StdioClientTransport;

  constructor({ name, version }: { name: string; version: string }) {
    this.name = name;
    this.version = version;

    this.mcp = new Client({ name, version });
  }

  async connectToServer({
    credentials,
  }: {
    credentials: {
      clientId: string;
      clientSecret: string;
      redirectUris: string[];
      refreshToken: string;
    };
  }) {
    try {
      this.transport = new StdioClientTransport({
        command: "ts-node",
        args: [
          `${process.cwd()}/servers/${this.name}`,
          `'${JSON.stringify({ credentials })}'`,
        ],
      });

      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      const tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });
      console.log(
        "Connected to server with tools:",
        tools.map(({ name }) => name),
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async listResource(params, options = undefined) {
    return this.mcp.listResources(params, options);
  }

  async readResource(params, options = undefined) {
    return this.mcp.readResource(params, options);
  }

  async callTool(
    params,
    resultSchema = CallToolResultSchema,
    options = undefined,
  ) {
    return this.mcp.callTool(params, resultSchema, options);
  }

  async listTools(params = undefined, options = undefined) {
    return this.mcp.listTools(params, options);
  }

  async close() {
    await this.mcp.close();
  }
}

export default McpClient;
