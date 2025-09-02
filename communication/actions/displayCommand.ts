const displayCommand = async (app) => {
  const successMessage = `Learning Submission Successful!`;
  try {
    await app.client.chat.postMessage({
      channel: "C07QHJ38M7S",
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
                text: `:white_check_mark: *Learning Submission Successful!*`,
              },
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error displaying command:", error);
    throw error;
  }
};

export { displayCommand };
