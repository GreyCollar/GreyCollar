import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: Number(__ENV.VUS || 100),
  iterations: Number(__ENV.ITERATIONS || 1000000),
  duration: "1h",
  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
  tags: {
    test_type: "load",
    environment: __ENV.ENVIRONMENT || "local",
  },
};

const BASE_URL =
  __ENV.BASE_URL ||
  "https://communication-land.gentleflower-99ef02e0.eastus.azurecontainerapps.io";

export default function () {
  const payload = JSON.stringify({
    colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
    content: "Where is the parking lot?",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer dcf0ac50d784ea9837ebf2e1a57d70d9",
    },
  };

  const res = http.post(`${BASE_URL}/test-chat`, payload, params);

  console.log(`Status: ${res.status}`);
  console.log(`Response body: ${res.body}`);

  check(res, {
    "status is 200": (r) => r.status === 200,
  }) || console.error(`Request failed with status ${res.status}: ${res.body}`);
}
