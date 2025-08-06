import {account} from "../../account";
import chat from "../../session";
import { getColleagues } from "../../api/getColleagues";
import storage from "../../Storage";

const selectTeam = async ({ action, ack, say, body }) => {
  await ack();
  const selectedTeamId = action.selected_option.value;
  const userId = body.user.id;

  storage.set("selectedTeamId", selectedTeamId);
  const session = chat.get(userId);
  chat.set(userId, { ...session, teamId: selectedTeamId });

  const sessions = account(body.message.user);

  const colleagues = await getColleagues(sessions);

  const colleagueOptions = colleagues.map((colleague) => ({
    text: {
      type: "plain_text",
      text: colleague.name,
      emoji: true,
    },
    value: colleague.id,
  }));

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "✨ *Please select a colleague:*",
        },
      },
      {
        type: "actions",
        block_id: "colleague_selection",
        elements: [
          {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a colleague",
              emoji: true,
            },
            action_id: "colleague_selected",
            options: colleagueOptions,
          },
        ],
      },
    ],
  });
};

export {
  selectTeam
};
