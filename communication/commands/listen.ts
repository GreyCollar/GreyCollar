const listen = async ({ command, ack, say }) => {
  await ack();

  try {
    const blocks = [
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Team",
            },
            action_id: "listen_team_select",
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
    console.error("Error handling /listen command:", error);
  }
};

export { listen };
