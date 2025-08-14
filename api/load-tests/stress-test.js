import { Rate, Trend } from "k6/metrics";
import { check, sleep } from "k6";

import http from "k6/http";

export const options = {
  stages: [
    { duration: "2m", target: 20 }, // Ramp up to 20 requests per second
    { duration: "5m", target: 20 }, // Stay at 20 requests per second
    { duration: "2m", target: 0 }, // Ramp down to 0 requests per second
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.1"],
    http_reqs: ["rate>100"],
  },
  tags: {
    test_type: "stress",
    environment: __ENV.ENVIRONMENT || "local",
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const errorRate = new Rate("errors");
const responseTimeTrend = new Trend("response_time");

export default function () {
  // Stress test with multiple concurrent requests
  const endpoints = [
    "/metrics",
    "/colleagues",
    "/tasks",
    "/projects",
    "/organizations",
    "/statistics",
    "/sessions",
    "/knowledge",
    "/messages",
    "/responsibilities",
    "/supervisings",
    "/integrations",
    "/communications",
  ];

  // Make multiple concurrent requests to stress the system
  const responses = http.batch([
    ["GET", `${BASE_URL}${endpoints[0]}`],
    ["GET", `${BASE_URL}${endpoints[1]}`],
    ["GET", `${BASE_URL}${endpoints[2]}`],
    ["GET", `${BASE_URL}${endpoints[3]}`],
    ["GET", `${BASE_URL}${endpoints[4]}`],
  ]);

  // Check all responses
  responses.forEach((response, index) => {
    const endpoint = endpoints[index];
    const success = check(response, {
      [`${endpoint} status is 200`]: (r) => r.status === 200,
      [`${endpoint} response time < 2000ms`]: (r) => r.timings.duration < 2000,
    });

    if (!success) {
      errorRate.add(1);
    }

    responseTimeTrend.add(response.timings.duration);
  });

  // Additional individual requests to increase load
  const randomEndpoint =
    endpoints[Math.floor(Math.random() * endpoints.length)];
  const individualResponse = http.get(`${BASE_URL}${randomEndpoint}`);

  check(individualResponse, {
    "individual request status is 200": (r) => r.status === 200,
    "individual request response time < 2000ms": (r) =>
      r.timings.duration < 2000,
  });

  // Minimal sleep to maximize request rate
  sleep(Math.random() * 1 + 0.1); // 0.1-1.1 seconds
}

