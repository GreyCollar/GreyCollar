import http from "../http";
import storage from "../Storage";

const createSession = async (accessToken?: string, colleagueId?: string) => {
  let selectedColleagueId = storage.get("selectedColleagueId") || colleagueId;

  const create = await http.post(
    `/sessions`,
    {
      type: "CHAT",
      colleagueId: selectedColleagueId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Session created", create.data);
  return create.data;
};

export { createSession };
