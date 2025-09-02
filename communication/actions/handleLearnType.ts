import { AnyBlock } from "@slack/types";

const handleLearnType = async ({ body, ack, client, action }) => {
  await ack();

  const learnType = body.actions[0].value.toUpperCase();
  const colleague =
    body.message.attachments[0].blocks[0].text.text.split("*")[1];

  let blocks: AnyBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:pencil2: You've chosen to learn from *${colleague}* using *${learnType}* format.\nPlease enter the required information:`,
      },
    },
  ];

  switch (learnType) {
    case "URL":
      blocks.push({
        type: "input",
        block_id: "url_block",
        element: {
          type: "plain_text_input",
          action_id: "url_input",
        },
        label: {
          type: "plain_text",
          text: "URL :link:",
        },
      });
      break;
    case "QA":
      blocks.push(
        {
          type: "input",
          block_id: "question_block",
          element: {
            type: "plain_text_input",
            action_id: "question_input",
          },
          label: {
            type: "plain_text",
            text: "Question :question:",
          },
        },
        {
          type: "input",
          block_id: "answer_block",
          element: {
            type: "plain_text_input",
            action_id: "answer_input",
            multiline: true,
          },
          label: {
            type: "plain_text",
            text: "Answer :bulb:",
          },
        }
      );
      break;
    case "TEXT":
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
      break;
  }

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Submit :rocket:",
        },
        value: learnType.toLowerCase(),
        action_id: "submit_learn_info",
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

export { handleLearnType };

