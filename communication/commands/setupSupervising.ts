import storage from "../Storage";

const setupSupervising = async ({ command, ack, say, body }) => {
  await ack();

  await storage.set("supervising_channel_id", command.channel_id);

  try {
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":brain: *Welcome to the Supervising!*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Team",
            },
            action_id: "supervising_team_select",
          },
        ],
      },
    ];

    await say({
      channel: command.channel_id,
      attachments: [
        {
          color: "#3366cc",
          blocks: blocks,
        },
      ],
    });
  } catch (error) {
    console.error("Error handling /supervising-setup command:", error);
  }
};

export { setupSupervising };

