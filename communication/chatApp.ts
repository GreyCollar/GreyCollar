import { App } from "@slack/bolt";
import { appOpen } from "./chat/events/appOpen";
import { chatCommand } from "./chat/commands/chat";
import dotenv from 'dotenv';
import { renew } from "./chat/commands/renew";
import { selectColleague } from "./chat/actions/selectColleague";
import { selectTeam } from "./chat/actions/selectTeam";
import { sendMessage } from "./chat/messages/sendMessage";

dotenv.config();

const createChatApp = () => {
  const popApp = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET_POPCHAT,
    token: process.env.SLACK_BOT_TOKEN_POPCHAT,
  });

  popApp.message(sendMessage);
  popApp.command("/renew", renew);
  popApp.command("/chat", chatCommand);
  popApp.action("team_selected", selectTeam);
  popApp.action("colleague_selected", selectColleague);
  popApp.event("app_home_opened", appOpen);

  return popApp;
};

export { createChatApp };