import http from "../http";

const getSession = async (accessToken,sessionId) => {
  const { data } = await http.get(`/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export { getSession };

