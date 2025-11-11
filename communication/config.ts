const config = {
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
      jobName: "greycollar-communication",
      instance: "default",
    },
  },
};

export default config;