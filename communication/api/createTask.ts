import http from "../http";

const createTask = async (session, description, status,colleagueId) => {
  const response = await http.post(
    "/tasks",
    { description, status, colleagueId },
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  return response.data;
};

export { createTask };

