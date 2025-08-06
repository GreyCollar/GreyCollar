import { account } from "../account";
import { getColleagues } from "../api/getColleagues";
import storage from "../Storage";

const colleagueSelect = async ({ body, ack, client }) => {
  await ack();

  const actionId = body.actions[0].action_id;

  let action_id;

  if(actionId === 'learn_colleague_select') {
    action_id = 'select_learn_type';
  } else if (actionId === 'task_colleague_select') {
    action_id = 'create_task';
  } else if (actionId === 'setup_colleague_select') {
    action_id = 'setup_ai_chat';
  } else if (actionId === 'supervising_colleague_select') {
    action_id = 'supervising_info';
  }
    
  await storage.set("selectedTeamId", body.actions[0].selected_option.value);
  console.log(body);

  const { user } = body.message;

  const session = account(user);

  try {
    const colleagues = await getColleagues(session);

    const blocks = [
      {
        type: "actions",
        elements: [
          {
            type: "static_select",
            action_id: action_id,
            placeholder: {
              type: "plain_text",
              text: "Select a colleague",
            },
            options: colleagues.map((colleague) => ({
              text: {
                type: "plain_text",
                text: colleague.name,
              },
              value: colleague.id,
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
    console.error("Error handling colleague select action:", error);
  }
};

export { colleagueSelect };

