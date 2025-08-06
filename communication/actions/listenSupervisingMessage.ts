import { account } from "../account";
import storage from "../Storage";
import { updateSupervising } from "../api/updateSupervising";

const listenSupervisingMessage = async ({ message, client }) => {
    try {
      const channel_id = await storage.get("supervising_channel_id");

      if (!channel_id) {
        console.error("No supervising channel ID found in storage");
        return;
      }

      if (channel_id === message.channel) {
        if ("user" in message) {
          const user = message.user;

          if ("thread_ts" in message) {
            try {
              const parentMessageResult = await client.conversations.history({
                channel: channel_id,
                latest: message.thread_ts,
                limit: 1,
                inclusive: true,
              });

              if (!parentMessageResult.ok) {
                throw new Error(
                  `Slack API error: ${parentMessageResult.error}`
                );
              }

              if (
                parentMessageResult.messages &&
                parentMessageResult.messages.length > 0
              ) {
                const parentMessage = parentMessageResult.messages[0];
                const { accessToken } = account(user);

                console.log("Parent message:", parentMessage);

                const refIdMatch = parentMessage.text
                  ? parentMessage.text.match(/\*Reference ID:\* ([^\n]+)/)
                  : null;

                const supervisingId = refIdMatch ? refIdMatch[1] : null;

                console.log("Supervising ID:", supervisingId);

                if (supervisingId) {
                  const response = await updateSupervising(
                    accessToken,
                    supervisingId,
                    message.text
                  );

                  console.log("Updated supervising:", response);
                } else {
                  console.log(
                    `No supervising ID found for thread with parent ts: ${parentMessage.ts}`
                  );
                }
              } else {
                console.log(
                  `No parent message found for thread_ts: ${message.thread_ts}`
                );
              }
            } catch (error) {
              console.error("Error processing thread message:", error);
            }
          } else {
            console.log("Message is not part of a thread");
          }
        } else {
          console.error("Message does not have user property");
        }
      }
    } catch (error) {
      console.error("Error in message handler:", error);
    }
  };

  export { listenSupervisingMessage };