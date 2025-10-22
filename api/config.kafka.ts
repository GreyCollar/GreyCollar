const kafkaConfig = {
  type: "kafka" as const,
  clientId: "greycollar",
  brokers: ["50.19.4.143:9092"],
  groupId: "greycollar",
};

export default kafkaConfig;
