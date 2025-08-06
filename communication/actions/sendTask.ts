import { account } from "../account";
import { createTask } from "../api/createTask";
import storage from "../Storage";

const sendTask = async ({ body, ack, client }) => {
  await ack();

  const { user } = body.message;

  const session = account(user);

  const colleagueId = storage.get("selectedColleagueId");
  const description = body.state.values.text_block.text_input.value;

  try {
    await createTask(session, description, "IN_PROGRESS", colleagueId);
    const successMessage = `Task Created Successful!`;

    await client.chat.delete({
      channel: body.channel.id,
      ts: body.message.ts,
    });

    await client.chat.postMessage({
      channel: body.channel.id,
      text: successMessage,
      attachments: [
        {
          color: "#36a64f",
          fallback: successMessage,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `:white_check_mark: *Task Created Successful!*\n\n:Task:\n${description}`,
              },
            },
          ],
        },
      ],
    });
  } catch (error) {
    const errorMessage = `Task Submission Failed. Please try again later.`;

    await client.chat.postMessage({
      channel: body.channel.id,
      text: errorMessage,
      attachments: [
        {
          color: "#ff0000",
          fallback: errorMessage,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `:x: *Learning Submission Failed*\n\nSomething went wrong !`,
              },
            },
          ],
        },
      ],
    });
  }
};

export { sendTask };

