const config = {
  project: {
    label: "Team",
    oauth: {
      jwt: {
        identifier: "id",
      },
      tokenUrl: "https://github.com/login/oauth/access_token",
      userUrl: "https://api.github.com/user",
      clientId: "Ov23liDUwCkj5NPpApo7",
    },
  },
  postgres: {
    uri: "sqlite::memory:",
    debug: true,
    sync: false,
  },
  dynamodb: {
    region: "us-east-1",
  },
  event: {
    type: "inMemory",
    host: "event.gentleflower-99ef02e0.eastus.azurecontainerapps.io",
    protocol: "https",
  },
  metrics: {
    enabled: true,
    interval: 15000,
    url: "http://98.88.24.46:9091",
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
