#!/usr/bin/env node

import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import os from "os";
import path from "path";
import { tools } from "./tools";

const server = new Server(
  {
    name: "grey-mock",
    version: "1.0.0-mock",
  },
  {
    capabilities: {
      resources: {
        schemes: ["grey"],
        listable: true,
        readable: true,
      },
      tools: {},
    },
  }
);

const logDir = path.join(
  os.tmpdir(),
  "greycollar",
  "mcp",
  process.pid.toString()
);
fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, "mcp.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  const message = args
    .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
    .join(" ");
  logStream.write(message + "\n");
  originalConsoleLog.apply(console, args);
};
originalConsoleLog("[MCP] Logging to:", logFile);

server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  return {
    data: [
      {
        id: "mock-resource-1",
        name: "Example Resource",
        mimeType: "text/plain",
      },
    ],
    nextPageToken: null,
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "text/plain",
        text: `This is mock content for resource: ${request.params.uri}`,
      },
    ],
  };
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  };
});

type InternalToolResponse = {
  content: { type: string; text: string }[];
  isError: boolean;
};

function convertToolResponse(response: InternalToolResponse) {
  return {
    _meta: {},
    content: response.content,
    isError: response.isError,
  };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.name === request.params.name);
  if (!tool) {
    return convertToolResponse({
      content: [{ type: "text", text: "Tool not found." }],
      isError: true,
    });
  }
  try {
    const result = await tool.handler(request.params.arguments as any);
    return convertToolResponse(result);
  } catch (err) {
    console.log("Error in CallToolRequestSchema handler:", err);
    return convertToolResponse({
      content: [{ type: "text", text: `Error: ${err}` }],
      isError: true,
    });
  }
});

async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

startServer().catch(console.error);

