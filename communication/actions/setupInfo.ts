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

const setupInfo = async ({ body, ack, client, say }) => {
  await ack();
  
  const selectedColleagueId = body.actions[0].selected_option.value;
  await storage.set("selectedColleagueId", selectedColleagueId);
  
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
  } catch (error) {
    console.error("Error handling action:", error);
  }
};

export { setupInfo };