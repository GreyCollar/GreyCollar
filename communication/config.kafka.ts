const kafkaConfig = {
  type: "kafka" as const,
  clientId: "greycollar",
  brokers: ["20.55.19.45:9092"],
  groupId: "greycollar",
};

export default kafkaConfig;
