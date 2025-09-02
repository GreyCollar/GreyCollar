import { account } from "../../account";
import chat from "../../session";
import { getTeams } from "../../api/getTeams";

const chatCommand = async ({ command, ack, say }) => {
  await ack();

  const { user_id } = command;

  const session = account(user_id);

  const teams = await getTeams(session);

  const teamOptions = teams.map((team) => ({
    text: {
      type: "plain_text",
      text: team.name,
      emoji: true,
    },
    value: team.id,
  }));

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "✨ *Please select a team:*",
        },
      },
      {
        type: "actions",
        block_id: "team_selection",
        elements: [
          {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a team",
              emoji: true,
            },
            action_id: "team_selected",
            options: teamOptions,
          },
        ],
      },
    ],
  });
  chat.set(user_id, { source: "chat" });
};

export { chatCommand };

