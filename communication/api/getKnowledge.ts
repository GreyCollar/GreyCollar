import http from "../http";

const getKnowledge = async (session) => {
  const { data } = await http.get("/knowledge", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data;
};

export { getKnowledge };

