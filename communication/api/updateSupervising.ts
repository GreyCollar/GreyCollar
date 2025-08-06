import http from "../http";

const updateSupervising = async (accessToken, supervisingId, answer) => {
  const message = await http.patch(
    `/supervisings/${supervisingId}`,
    {
      answer,
      status: "ANSWERED",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return message.data;
};

export { updateSupervising };

