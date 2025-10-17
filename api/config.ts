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
    type: "inMemory",
    host: "event.gentleflower-99ef02e0.eastus.azurecontainerapps.io",
    protocol: "https",
  },
  pushGateway: {
    url: "http://localhost:9091",
    jobName: "greycollar-database",
    instance: "default",
    interval: 15000,
  },
  pushGateWayOpenTelemetry: {
    url: "http://localhost:9091",
    jobName: "greycollar-opentelemetry",
    instance: "default",
    interval: 15000,
  },
  pushGatewayNodeEvents: {
    url: "http://localhost:9091",
    jobName: "greycollar-api",
    instance: "node-events",
    interval: 15000,
  },
};

export default config;
