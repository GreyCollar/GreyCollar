import http from "../http";

const getColleagues = async (session) => {
  const { data } = await http.get("/colleagues", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data;
};

export { getColleagues };