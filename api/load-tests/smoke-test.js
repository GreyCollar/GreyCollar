import { check, sleep } from "k6";

import http from "k6/http";

export const options = {
  vus: 1,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
  },
  tags: {
    test_type: "smoke",
    environment: __ENV.ENVIRONMENT || "local",
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

export default function () {
  // Test 1: Health check - metrics endpoint
  const metricsResponse = http.get(`${BASE_URL}/metrics`);
  check(metricsResponse, {
    "metrics endpoint status is 200": (r) => r.status === 200,
    "metrics response time < 100ms": (r) => r.timings.duration < 100,
  });

  sleep(1);

  // Test 2: Basic API endpoints
  const endpoints = ["/colleagues", "/tasks", "/projects", "/organizations"];

  endpoints.forEach((endpoint) => {
    const response = http.get(`${BASE_URL}${endpoint}`);
    check(response, {
      [`${endpoint} status is 200`]: (r) => r.status === 200,
      [`${endpoint} response time < 500ms`]: (r) => r.timings.duration < 500,
    });

    sleep(0.5);
  });

  // Test 3: Error handling - non-existent endpoint
  const notFoundResponse = http.get(`${BASE_URL}/non-existent-endpoint`);
  check(notFoundResponse, {
    "non-existent endpoint returns 404": (r) => r.status === 404,
  });

  sleep(1);
}

