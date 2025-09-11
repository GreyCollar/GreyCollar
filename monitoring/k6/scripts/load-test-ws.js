import http from "k6/http";

export const options = {
  vus: Number(__ENV.VUS || 1),
  iterations: Number(__ENV.ITERATIONS || 100),
  thresholds: {
    http_req_duration: ["p(95)<1000"],
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
  const userActions = [
    () => {
      const response = http.post(`${BASE_URL}/test-chat`, {
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        content: "i wanna buy battery",
      });
      return response;
    },
  ];

  const randomAction =
    userActions[Math.floor(Math.random() * userActions.length)];
  randomAction();
}
