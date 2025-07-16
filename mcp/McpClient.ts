import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

class McpClient {
  private name: string;
  private tool: string;
  private version: string;
  private mcp: Client;
  private transport!: StdioClientTransport;

  constructor({
    name,
    version,
    tool,
  }: {
    name: string;
    version: string;
    tool: string;
  }) {
    this.name = name;
    this.tool = tool;
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
      const serverPath = `${path.dirname(process.cwd())}\\mcp\\servers\\${
        this.name
      }`;

      console.log(serverPath);

      this.transport = new StdioClientTransport({
        command: "ts-node",
        args: [serverPath, `'${JSON.stringify({ credentials })}'`],
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
        tools.map(({ name }) => name)
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
    options = undefined
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
