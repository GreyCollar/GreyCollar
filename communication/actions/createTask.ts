import { AnyBlock } from "@slack/types";
import storage from "../Storage";

const createTask = async ({ body, ack, client, action }) => {
  await ack();
  
  const colleagueId = body.actions[0].selected_option.value;
  
  storage.set("selectedColleagueId", colleagueId);

  let blocks: AnyBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:pencil2: \nPlease enter the describe task:`,
      },
    },
  ];

  blocks.push({
    type: "input",
    block_id: "text_block",
    element: {
      type: "plain_text_input",
      action_id: "text_input",
      multiline: true,
    },
    label: {
      type: "plain_text",
      text: "Text :memo:",
    },
  });

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Submit :rocket:",
        },
        value: "Create Task",
        action_id: "send_task",
        style: "primary",
      },
    ],
  });

  try {
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      attachments: [
        {
          color: "#ff9900",
          blocks: blocks,
        },
      ],
    });
  } catch (error) {
    console.error("Error updating message:", error);
  }
};

export { createTask };

