import http from "../http";

const getSupervisings = async (accessToken) => {
  const { data } = await http.get(`/supervisings`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export { getSupervisings };

