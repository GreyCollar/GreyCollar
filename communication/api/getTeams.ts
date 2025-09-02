import http from "../http";

const getTeams = async (session) => {
  const { data } = await http.get("/projects", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data;
};

export { getTeams };

