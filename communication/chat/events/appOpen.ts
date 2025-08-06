const appOpen = async ({ event, say }) => {
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "👋 Welcome to PopChat! Start a chat with the `/chat` command.",
        },
      },
    ],
  });
};

export  {
  appOpen
};
