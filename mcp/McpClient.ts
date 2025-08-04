import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

class McpClient {
  private name: string;
  private tool: string;
  private version: string;
  private mcp!: Client;
  private transport!: StdioClientTransport;
  private isConnected = false;

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
      const serverPath = path.join(path.dirname(process.cwd()), 'mcp', 'servers', this.name);
      this.transport = new StdioClientTransport({
        command: "ts-node",
        args: [serverPath, `'${JSON.stringify({ credentials })}'`],
      });

      this.mcp = new Client({ name: this.name, version: this.version });
      await this.mcp.connect(this.transport);
      this.isConnected = true;

      const toolsResult = await this.mcp.listTools();
      const tools = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      }));
      console.log(
        "Connected to server with tools:",
        tools.map(({ name }) => name)
      );
    } catch (e) {
      this.isConnected = false;
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  private ensureConnected() {
    if (!this.isConnected || !this.mcp) {
      throw new Error("Not connected to MCP server");
    }
  }

  async listResource(params, options = undefined) {
    this.ensureConnected();
    return this.mcp.listResources(params, options);
  }

  async readResource(params, options = undefined) {
    this.ensureConnected();
    return this.mcp.readResource(params, options);
  }

  async callTool(toolName: string, params: any) {
    this.ensureConnected();
    return this.mcp.callTool({
      name: toolName,
      arguments: params,
    });
  }

  async listTools(params = undefined, options = undefined) {
    this.ensureConnected();
    return this.mcp.listTools(params, options);
  }

  async close() {
    if (this.mcp) {
      await this.mcp.close();
      this.isConnected = false;
    }
  }
}

export default McpClient;
