import http from "../http";

const getColleague = async (accessToken, colleagueId) => {
  const { data } = await http.get(`/colleagues/${colleagueId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export { getColleague };

