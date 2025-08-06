import { account } from "../account";
import { createSession } from "../api/createSession";
import { getSession } from "../api/getSession";
import { sendMessageToSession } from "../api/sendMessageSession";
import storage from "../Storage";

const listenAiMessage = async ({ message, client }) => {
  const channel_id = await storage.get("ai_chat_channel_id");

  if (
    "text" in message &&
    "user" in message &&
    channel_id === message.channel
  ) {
    const question = message.text;
    const user = message.user;

    const { accessToken } = account(user);

    const response = await createSession(accessToken);
    const sessionId = response.id;

    await sendMessageToSession(sessionId, accessToken, question);

    storage.set("sessionId", sessionId);

    const POLLING_INTERVAL = 5000;

    async function pollSession(
      sessionId: string,
      channelId: string,
      messageTs: string
    ) {
      const messagedSessionIds = new Set<string>();

      const intervalId = setInterval(async () => {
        const { accessToken } = account(user);

        const sessions = await getSession(accessToken, sessionId);
        console.log("Sessions", sessions);

        for (const session of sessions) {
          if (
            session.role === "ASSISTANT" &&
            !messagedSessionIds.has(session.id)
          ) {
            await client.chat.postMessage({
              channel: channelId,
              text: session.content,
              thread_ts: messageTs,
            });
            messagedSessionIds.add(session.id);
          }
        }

        const allValid = sessions.every((session) => session.isValid);
        if (allValid) {
          clearInterval(intervalId);
          console.log("All sessions are valid, stopping polling.");
        }
      }, POLLING_INTERVAL);
    }
    if (channel_id === message.channel) {
      pollSession(sessionId, channel_id, message.ts);
    }
  } else {
    console.error("Message does not have the required properties.");
  }
};

export { listenAiMessage };

