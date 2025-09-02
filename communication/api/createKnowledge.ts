import http from "../http";

const createKnowledge = async (
  session,
  learnType,
  colleagueId,
  learningInfo
) => {
  let body = { colleagueId, type: learnType } as { 
    colleagueId: string; 
    type: string; 
    url?: string; 
    answer?: string; 
    question?: string; 
    text?: string;
  }

  switch (learnType) {
    case "URL":
      body.url = learningInfo;
      break;
    case "QA":
      body.answer = learningInfo.answer;
      body.question = learningInfo.question;
      break;
    case "TEXT":
      body.text = learningInfo;
      break;
  }

  const response = await http.post("/knowledge", body, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  console.log("Knowledge created:", response.data);

  return response.data;
};

export { createKnowledge };

