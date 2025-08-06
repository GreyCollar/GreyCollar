import chat from "../../session";
import storage from "../../Storage";

const selectColleague = async ({ action, ack, body, say }) => {
  await ack();
  const selectedColleagueId = action.selected_option.value;
  const userId = body.user.id;

  storage.set("selectedColleagueId", selectedColleagueId);
  const session = chat.get(userId);
  chat.set(userId, { ...session, colleagueId: selectedColleagueId });

  let messageText = "You can start chatting now.";
  if (session.source === "renew") {
    messageText = "Session is renewed.";
  }

  await say(messageText);
};

export { selectColleague };
