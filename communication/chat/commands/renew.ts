import chat from "../../session";

const renew = async ({ command, ack, say }) => {
  await ack();
  const { user_id } = command;

  chat.delete(user_id);

  await say("Session is renewed.");
};

export {
  renew
};
