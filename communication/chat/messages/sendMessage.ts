import { account } from "../../account";
import chat from "../../session";
import { createSession } from "../../api/createSession";
import { sendMessageToSession } from "../../api/sendMessageSession";
import { v4 as uuidv4 } from 'uuid';

const qa = {
  hello: "Hello! How can I help you?",
  "what is your name?": "I am PopChat.",
  "where is the parking lot?": "It is down the street.",
  "what is the weather today?": "It is sunny today.",
  "how can I contact you?": "You cannot contact me.",
  "is there a coffee shop nearby?": "Yes, there is a coffee shop nearby.",
  "chicken or beef?": "I am a bot, I don't eat.",
  "what is your app?": "I am a Slack bot built using the Bolt framework.",
};

function getAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  return (
    qa[normalizedQuestion] ||
    "I'm sending you to Supervisor. Please wait for a moment."
  );
}

const sendMessage = async ({ message, say }) => {
  if (message.subtype || message.bot_id) {
    return;
  }

  const { user } = message;
  const { accessToken } = account(user);

  let session = chat.get(user);

  if (!session) {
    await say("You should start a chat with the `/chat` command.");
    return;
  }

  session = chat.set(user, uuidv4());

  await createSession(accessToken);

  const question = message.text;
  const answer = getAnswer(question);

  await sendMessageToSession(session, accessToken, question);

  await say(answer);
};

export {
  sendMessage
};
