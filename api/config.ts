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
    host: "localhost",
    port: 8080,
    protocol: "http",
  },
};

export default config;
