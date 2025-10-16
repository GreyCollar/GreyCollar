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
  pushGateway: {
    url: "http://52.191.251.120:9091",
    jobName: "greycollar-database",
    instance: "default",
    interval: 15000,
  },
};

export default config;
