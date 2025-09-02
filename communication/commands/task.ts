const task = async ({ command, ack, say }) => {
    await ack();
  
    try {
      const blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":brain: *Welcome to the Task!*",
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
              action_id: "task_team_select",
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
      console.error("Error handling /task command:", error);
    }
  };
  
  export { task };
  