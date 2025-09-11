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
    uri: "postgresql://postgres.nucleoid.com:5432/land",
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
};

export default config;
