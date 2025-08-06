const learn = async ({ command, ack, say }) => {
  await ack();

  try {
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":brain: *Welcome to the Nuc Learning!*",
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
            action_id: "learn_team_select",
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
    console.error("Error handling /learn command:", error);
  }
};

export { learn };
