const Integrations = [
  {
    id: "8f828016-dd2e-4f76-bad5-2a0ca9b71d6f",
    action: "GDRIVE:search",
    provider: "GOOGLE DRIVE",
    description: "Search for files in Google Drive",
    oauth: {
      scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      tokenUrl: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      clientScript: "https://accounts.google.com/gsi/client",
    },
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to find files in Google Drive.",
        },
      },
      required: ["query"],
    },
  },
  {
    id: "1d49fadb-93e3-43cc-88e4-f3bfc2ea4f0e",
    action: "SLACK:search",
    provider: "SLACK",
    description: "Search for messages in Slack",
    oauth: {
      scope: "search:read",
      tokenUrl: "https://slack.com/api/oauth.v2.access",
    },
    direction: "INCOMING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term to look for messages or files in Slack.",
        },
      },
      required: ["query"],
    },
  },
  {
    id: "9e35c8d5-df44-44d9-8f9e-b4f4f3b1043d",
    action: "DISCORD:search",
    provider: "DISCORD",
    description: "Search for messages in Discord",
    oauth: {
      scope: "messages.read",
      tokenUrl: "https://discord.com/api/oauth2/token",
    },
    direction: "INCOMING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword to search within Discord messages.",
        },
      },
      required: ["query"],
    },
  },
  {
    id: "a0e40e76-1b2a-4a13-947f-939a9ad354b4",
    action: "JIRA:search",
    provider: "JIRA",
    description: "Search for issues in JIRA",
    oauth: {
      scope: "read:jira-work",
      tokenUrl: "https://auth.atlassian.com/oauth/token",
    },
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "JQL or text to search for issues in JIRA.",
        },
      },
      required: ["query"],
    },
  },
  {
    id: "fa1eec4e-35c0-4e0c-8b1b-36c0a4ea95ee",
    action: "GITHUB:search",
    provider: "GITHUB",
    description: "Search for repositories on GitHub",
    oauth: {
      scope: "repo",
      tokenUrl: "https://github.com/login/oauth/access_token",
    },
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term to look for repositories on GitHub.",
        },
      },
      required: ["query"],
    },
  },
  {
    id: "31ea5f17-045d-47d0-b9d3-ffc5d8f7b4cb",
    action: "GREY-MARKET:check_product_count",
    provider: "GREY-MARKET",
    description: "Check product count",
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "The ID of the product to check the count of.",
        },
      },
      required: ["productId"],
    },
  },
  {
    id: "90627148-0d9c-405f-90a4-48be9935eb3b",
    action: "GREY-MARKET:create_order",
    provider: "GREY-MARKET",
    description: "Create an order",
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "The ID of the product to create an order for.",
        },
        quantity: {
          type: "number",
          description: "The quantity of the product to create an order for.",
        },
      },
      required: ["productId", "quantity"],
    },
  },
  {
    id: "90627148-0d9c-405f-90a4-48be9935eb3b",
    action: "GREY-MARKET:reduce_product_count",
    provider: "GREY-MARKET",
    description: "Reduce product count",
    direction: "OUTGOING",
    lib: "mcp",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "The ID of the product to reduce the count of.",
        },
        quantity: {
          type: "number",
          description: "The quantity of the product to reduce the count of.",
        },
      },
      required: ["productId", "quantity"],
    },
  },
];
export default Integrations;

