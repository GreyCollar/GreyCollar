import { check, sleep } from "k6";

import { Rate } from "k6/metrics";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "2m", target: 10 }, // Ramp up to 10 users
    { duration: "5m", target: 10 }, // Stay at 10 users
    { duration: "2m", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.05"],
    http_reqs: ["rate>50"],
  },
  tags: {
    test_type: "load",
    environment: __ENV.ENVIRONMENT || "local",
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const errorRate = new Rate("errors");

export default function () {
  // Simulate realistic user behavior
  const userActions = [
    // Browse colleagues
    () => {
      const response = http.get(`${BASE_URL}/colleagues`);
      const success = check(response, {
        "colleagues endpoint status is 200": (r) => r.status === 200,
        "colleagues response time < 800ms": (r) => r.timings.duration < 800,
      });
      if (!success) errorRate.add(1);
      return response;
    },

    // View tasks
    () => {
      const response = http.get(`${BASE_URL}/tasks`);
      const success = check(response, {
        "tasks endpoint status is 200": (r) => r.status === 200,
        "tasks response time < 800ms": (r) => r.timings.duration < 800,
      });
      if (!success) errorRate.add(1);
      return response;
    },

    // Check projects
    () => {
      const response = http.get(`${BASE_URL}/projects`);
      const success = check(response, {
        "projects endpoint status is 200": (r) => r.status === 200,
        "projects response time < 800ms": (r) => r.timings.duration < 800,
      });
      if (!success) errorRate.add(1);
      return response;
    },

    // View organizations
    () => {
      const response = http.get(`${BASE_URL}/organizations`);
      const success = check(response, {
        "organizations endpoint status is 200": (r) => r.status === 200,
        "organizations response time < 800ms": (r) => r.timings.duration < 800,
      });
      if (!success) errorRate.add(1);
      return response;
    },

    // Check statistics
    () => {
      const response = http.get(`${BASE_URL}/statistics`);
      const success = check(response, {
        "statistics endpoint status is 200": (r) => r.status === 200,
        "statistics response time < 1000ms": (r) => r.timings.duration < 1000,
      });
      if (!success) errorRate.add(1);
      return response;
    },

    // View sessions
    () => {
      const response = http.get(`${BASE_URL}/sessions`);
      const success = check(response, {
        "sessions endpoint status is 200": (r) => r.status === 200,
        "sessions response time < 800ms": (r) => r.timings.duration < 800,
      });
      if (!success) errorRate.add(1);
      return response;
    },
  ];

  // Randomly select and execute user actions
  const randomAction =
    userActions[Math.floor(Math.random() * userActions.length)];
  randomAction();

  // Random sleep to simulate real user behavior
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

