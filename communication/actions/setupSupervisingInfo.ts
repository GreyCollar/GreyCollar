import { account } from "../account";
import { getSupervisings } from "../api/getSupervisings";
import storage from "../Storage";

const setupSuccessfullyBlock = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Setup successfully completed!",
    },
  },
];

const setupSupervisingInfo = async ({ body, ack, client, say }) => {
  await ack();

  const selectedColleagueId = body.actions[0].selected_option.value;
  await storage.set("selectedColleagueId", selectedColleagueId);

  const setupTimestamp = new Date().toISOString();
  await storage.set("setupTimestamp", setupTimestamp);

  try {
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      metadata: {},
      attachments: [
        {
          color: "#3366cc",
          blocks: setupSuccessfullyBlock,
        },
      ],
    });

    pollForNewSupervising(
      client,
      body.channel.id,
      body.message.user,
      body.message
    );
  } catch (error) {
    console.error("Error handling action:", error);
  }
};

const pollForNewSupervising = async (client, channelId, user, message) => {
  let previousSupervisings = (await storage.get("supervisingInfo")) || [];
  const setupTimestamp = await storage.get("setupTimestamp");

  setInterval(async () => {
    try {
      const newSupervisings = await fetchNewSupervisingInfo(user);

      const newEntries = newSupervisings.filter((newSupervising) => {
        const isNew = !previousSupervisings.some(
          (prev) => prev.id === newSupervising.id
        );
        const isAfterSetup =
          new Date(newSupervising.createdAt) > new Date(setupTimestamp);
        return isNew && newSupervising.status === "IN_PROGRESS" && isAfterSetup;
      });

      for (const entry of newEntries) {
        await client.chat.postMessage({
          channel: channelId,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*New Question:*\n${entry.question}\n\n*Status:* ${
                  entry.status
                }\n*Created:* ${new Date(entry.createdAt).toLocaleString()}\n*Reference ID:* ${entry.id}`,
              },
            },
          ],
        });
      }

      if (newEntries.length > 0) {
        previousSupervisings = newSupervisings;
        await storage.set("supervisingInfo", newSupervisings);
      }
    } catch (error) {
      console.error("Error polling supervising info:", error);
    }
  }, 10000);
};

const fetchNewSupervisingInfo = async (user) => {
  const { accessToken } = account(user);
  try {
    const response = await getSupervisings(accessToken);
    return response;
  } catch (error) {
    console.error("Error fetching supervising info:", error);
    return [];
  }
};

export { setupSupervisingInfo };

