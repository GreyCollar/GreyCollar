import { Rate, Trend } from "k6/metrics";
import { check, sleep } from "k6";

import http from "k6/http";

export const options = {
  stages: [
    { duration: "10s", target: 100 }, // Spike to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "10s", target: 0 }, // Drop to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    http_req_failed: ["rate<0.15"],
    http_reqs: ["rate>200"],
  },
  tags: {
    test_type: "spike",
    environment: __ENV.ENVIRONMENT || "local",
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const errorRate = new Rate("errors");
const responseTimeTrend = new Trend("response_time");

export default function () {
  // Spike test with aggressive request patterns
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

  // Make multiple concurrent requests to simulate spike
  const batchSize = Math.floor(Math.random() * 3) + 2; // 2-4 concurrent requests
  const batchEndpoints = [];

  for (let i = 0; i < batchSize; i++) {
    const randomEndpoint =
      endpoints[Math.floor(Math.random() * endpoints.length)];
    batchEndpoints.push(["GET", `${BASE_URL}${randomEndpoint}`]);
  }

  const responses = http.batch(batchEndpoints);

  // Check all batch responses
  responses.forEach((response, index) => {
    const success = check(response, {
      "batch request status is 200": (r) => r.status === 200,
      "batch request response time < 3000ms": (r) => r.timings.duration < 3000,
    });

    if (!success) {
      errorRate.add(1);
    }

    responseTimeTrend.add(response.timings.duration);
  });

  // Additional rapid individual requests
  const rapidRequests = Math.floor(Math.random() * 3) + 1; // 1-3 rapid requests

  for (let i = 0; i < rapidRequests; i++) {
    const randomEndpoint =
      endpoints[Math.floor(Math.random() * endpoints.length)];
    const response = http.get(`${BASE_URL}${randomEndpoint}`);

    check(response, {
      "rapid request status is 200": (r) => r.status === 200,
      "rapid request response time < 3000ms": (r) => r.timings.duration < 3000,
    });

    responseTimeTrend.add(response.timings.duration);
  }

  // Very minimal sleep to maximize spike effect
  sleep(Math.random() * 0.5 + 0.05); // 0.05-0.55 seconds
}

