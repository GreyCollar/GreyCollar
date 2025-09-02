import storage from "../Storage";

const setupAIChat = async ({ command, ack, say, body }) => {
  await ack();

  await storage.set("ai_chat_channel_id", command.channel_id);

  try {
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":brain: *Welcome to the AI Chat!*",
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
            action_id: "setup_team_select",
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
    console.error("Error handling /setup command:", error);
  }
};

export { setupAIChat };

