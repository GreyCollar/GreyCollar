import { account } from "../account";
import { getTeams } from "../api/getTeams";

const teamSelect = async ({ body, ack, client, say }) => {
  await ack();

  const actionId = body.actions[0].action_id;

  const { user } = body.message;

  const session = account(user);

  let nexActionId;

  if (actionId === "learn_team_select") {
    nexActionId = "learn_colleague_select";
  } else if (actionId === "learn_team_select") {
    nexActionId = "task_colleague_select";
  } else if (actionId === "setup_team_select") {
    nexActionId = "setup_colleague_select";
  } else if (actionId === "supervising_team_select") {
    nexActionId = "supervising_colleague_select";
  } else {
    nexActionId = "listen_notifications";
  }

  try {
    const teams = await getTeams(session);

    const blocks = [
      {
        type: "actions",
        elements: [
          {
            type: "static_select",
            action_id: nexActionId,
            placeholder: {
              type: "plain_text",
              text: "Select a Team",
            },
            options: teams.map((team) => ({
              text: {
                type: "plain_text",
                text: team.name,
              },
              value: team.id,
            })),
          },
        ],
      },
    ];

    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      metadata: {},
      attachments: [
        {
          color: "#3366cc",
          blocks: blocks,
        },
      ],
    });
  } catch (error) {
    console.error("Error handling team select action:", error);
  }
};
export { teamSelect };

