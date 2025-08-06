import { account } from "../account";
import { createKnowledge } from "../api/createKnowledge";
import storage from "../Storage";

const submitLearnInfo = async ({ body, ack, client }) => {
  await ack();

  const { user } = body.message;

  const session = account(user);

  const learnType = body.actions[0].value.toUpperCase();

  const colleague = body.message.attachments[0].blocks[0].text.text
    .split("*")[1]
    .split("*")[0]
    .trim();

  const colleagueId = body.message.metadata.event_payload.colleagueId;

  let learningInfo:
    | string
    | {
        question: string;
        answer: string;
      } = "";

  switch (learnType) {
    case "URL":
      learningInfo = body.state.values.url_block.url_input.value;
      break;
    case "QA":
      const question = body.state.values.question_block.question_input.value;
      const answer = body.state.values.answer_block.answer_input.value;
      learningInfo = { question, answer };
      break;
    case "TEXT":
      learningInfo = body.state.values.text_block.text_input.value;
      break;
  }

  try {
    await createKnowledge(session, learnType, colleagueId, learningInfo);

    const successMessage = `Learning Submission Successful! Colleague: ${colleague}, Type: ${learnType}, Information Provided: ${learningInfo}`;

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
                text: `:white_check_mark: *Learning Submission Successful!*\n\n:bust_in_silhouette: *Colleague:* ${colleague}\n:bookmark_tabs: *Type:* ${learnType}\n\n:information_source: *Information Provided:*\n${learningInfo}`,
              },
            },
          ],
        },
      ],
    });

    const teamId = storage.get("selectedTeamId");
  } catch (error) {
    console.error("Error handling submit_learn_info:", error);

    const errorMessage = `Learning Submission Failed. Please try again later.`;

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
                text: `:x: *Learning Submission Failed*\n\nSomething went wrong !\n\n:bust_in_silhouette: *Colleague:* ${colleague}\n:bookmark_tabs: *Type:* ${learnType}`,
              },
            },
          ],
        },
      ],
    });
  }
};

export { submitLearnInfo };
