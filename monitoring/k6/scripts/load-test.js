import { check } from "k6";
import http from "k6/http";

const BASE_URL =
  "https://communication-land.gentleflower-99ef02e0.eastus.azurecontainerapps.io";
const TOKEN = "dcf0ac50d784ea9837ebf2e1a57d70d9";

export const options = {
  scenarios: {
    scenarios: {
      executor: 'constant-vus',
      vus: 250,
      duration: "1h",
    },
  },
};

export default function () {
  const url = `${BASE_URL}/test-chat`;

  const payload = JSON.stringify({
    colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
    content: "Where is the parking lot?",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    timeout: "30s",
  };

  const response = http.post(url, payload, params);

  console.log(`Status: ${response.status}`);
}
