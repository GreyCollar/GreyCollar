const selectLearnType = async ({ body, ack, client, action }) => {
  await ack();
  const colleagueId = body.actions[0].selected_option.value;
  const selectedColleague = body.actions[0].selected_option.text.text;

  const metadata = {
    event_type: "colleague_select",
    event_payload: `{"colleagueId":"${colleagueId}"}`,
  };

  try {
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      metadata: metadata,
      attachments: [
        {
          color: "#ff9900",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `You selected: *${selectedColleague}*\n\nChoose a learning type:`,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "URL  :link:",
                  },
                  value: "url",
                  action_id: "learn_type_url",
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Q&A :question:",
                  },
                  value: "qa",
                  action_id: "learn_type_qa",
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Text :memo:",
                  },
                  value: "text",
                  action_id: "learn_type_text",
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error updating message:", error);
  }
};

export {
  selectLearnType
};

