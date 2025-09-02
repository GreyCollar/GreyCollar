import http from "../http";

const sendMessageToSession = async (session, accessToken, question) => {

  const message = await http.post(
    `/sessions/${session}`,
    {
      content: question,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return message.data;
};

export { sendMessageToSession };

