const config = {
  project: {
    label: "Team",
    oauth: {
      jwt: {
        identifier: "id",
      },
      tokenUrl: "https://github.com/login/oauth/access_token",
      userUrl: "https://api.github.com/user",
      clientId: "Ov23lihgDzlqJ1gnZxX3",
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
    host: "event.gentleflower-99ef02e0.eastus.azurecontainerapps.io",
    protocol: "https",
  },
};

export default config;
