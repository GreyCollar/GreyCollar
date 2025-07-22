#!/usr/bin/env node

import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { InternalToolResponse } from "./tools/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import cli from "../../lib/cli";
import fs from "fs";
import { google } from "googleapis";
import os from "os";
import path from "path";
import { tools } from "./tools";

const { credentials } = cli.args();

const oauth2Client = new google.auth.OAuth2(
  credentials.clientId,
  credentials.clientSecret,
  credentials.redirectUris[0]
);

oauth2Client.setCredentials({
  refresh_token: credentials.refreshToken,
});

// Export a getter for the shared OAuth2 client
export function getOAuth2Client() {
  return oauth2Client;
}

const refreshAccessToken = async () => {
  try {
    const { credentials: newTokens } = await oauth2Client.refreshAccessToken();
    console.log("newTokens", newTokens);
    oauth2Client.setCredentials(newTokens);
  } catch (error) {
    console.log("error", error);
    console.error("Failed to refresh access token:", error);
  }
};


const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const server = new Server(
  {
    name: "gdrive",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {
        schemes: ["gdrive"],
        listable: true,
        readable: true,
      },
      tools: {},
    },
  }
);

console.log("MCP log test: This should appear in the log file.");
// Setup log file for console.log
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
console.log("MCP log test: This should appear in the log file.");

console.log("credentials", credentials);

refreshAccessToken();


server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  const pageSize = 10;
  const params: any = {
    pageSize,
    fields: "nextPageToken, files(id, name, mimeType)",
  };

  if (request.params?.cursor) {
    params.pageToken = request.params.cursor;
  }

  const res = await drive.files.list(params);
  const files = res.data.files!;

  return {
    resources: files.map((file) => ({
      uri: `gdrive:///${file.id}`,
      mimeType: file.mimeType,
      name: file.name,
    })),
    nextCursor: res.data.nextPageToken,
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const fileId = request.params.uri.replace("gdrive:///", "");
  const readFileTool = tools[1]; // gdrive_read_file is the second tool
  const result = await readFileTool.handler({ fileId });

  const fileContents = result.content[0].text.split("\n\n")[1]; // Skip the "Contents of file:" prefix

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "text/plain", // You might want to determine this dynamically
        text: fileContents,
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

function convertToolResponse(response: InternalToolResponse) {
  console.log("response", response);
  return {
    _meta: {},
    content: response.content,
    isError: response.isError,
  };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.name === request.params.name);
  console.log("tool", tool);
  if (!tool) {
    throw new Error("Tool not found");
  }
  try {
    console.log("request.params.arguments", request.params.arguments);
    const result = await tool.handler(request.params.arguments as any);
    console.log("result", result);
    return convertToolResponse(result);
  } catch (err) {
    console.log("Error in CallToolRequestSchema handler:", err);
    throw err;
  }
});

async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

startServer().catch(console.error);
