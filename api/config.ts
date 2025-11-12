const config = {
  project: {
    label: "Team",
    oauth: {
      jwt: {
        identifier: "id",
      },
      providers: {
        github: {
          tokenUrl: "https://github.com/login/oauth/access_token",
          userUrl: "https://api.github.com/user",
          clientId: "Ov23lihgDzlqJ1gnZxX3",
          userIdentifier: "id",
          userFields: {
            name: "login",
            displayName: "name",
            avatarUrl: "avatar_url",
            email: "email",
          },
        },
      },
    },
  },
  postgres: {
    uri: "sqlite::memory:",
    debug: true,
    sync: true,
  },
  dynamodb: {
    region: "us-east-1",
  },
  event: {
    type: "inMemory" as const,
    host: "localhost",
    protocol: "http" as const,
    port: 8080,
  },
  metrics: {
    enabled: false,
    interval: 15000,
    url: "http://localhost:9091",
    pushGateway: {
      jobName: "greycollar-database",
      instance: "default",
    },
    pushGateWayOpenTelemetry: {
      jobName: "greycollar-opentelemetry",
      instance: "default",
    },
    pushGatewayNodeEvents: {
      jobName: "greycollar-api",
      instance: "node-events",
    },
  },
};

export default config;
