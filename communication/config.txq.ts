const txqConfig = {
  type: "txeventq" as const,
  connectString: "localhost:1522/FREEPDB1",
  user: "txeventq_user",
  password: "pass123",
  queueName: "EVENT_TOPIC",
  instantClientPath:
    "C:\\Users\\Halil\\Downloads\\instantclient-basic-windows.x64-23.9.0.25.07\\instantclient_23_9",
};

export default txqConfig;
