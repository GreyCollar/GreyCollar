/* eslint-disable */
// This file is run by k6, not Node.js, so k6 globals are available
export const options = {
  // Test scenarios
  scenarios: {
    // Smoke test - verify the system works under minimal load
    smoke: {
      executor: "constant-vus",
      vus: 1,
      duration: "1m",
      exec: "smoke",
      tags: { test_type: "smoke" },
    },
    // Load test - verify the system behavior under expected load
    load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 10 }, // Ramp up to 10 users
        { duration: "5m", target: 10 }, // Stay at 10 users
        { duration: "2m", target: 0 }, // Ramp down to 0 users
      ],
      exec: "load",
      tags: { test_type: "load" },
    },
    // Stress test - find the breaking point
    stress: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 50,
      maxVUs: 100,
      stages: [
        { duration: "2m", target: 20 }, // Ramp up to 20 requests per second
        { duration: "5m", target: 20 }, // Stay at 20 requests per second
        { duration: "2m", target: 0 }, // Ramp down to 0 requests per second
      ],
      exec: "stress",
      tags: { test_type: "stress" },
    },
    // Spike test - verify the system behavior under sudden load
    spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 100 }, // Spike to 100 users
        { duration: "1m", target: 100 }, // Stay at 100 users
        { duration: "10s", target: 0 }, // Drop to 0 users
      ],
      exec: "spike",
      tags: { test_type: "spike" },
    },
  },

  // Thresholds for test success criteria
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.1"], // Error rate should be below 10%
    http_reqs: ["rate>100"], // Should handle at least 100 requests per second
  },

  // Global tags
  tags: {
    environment: __ENV.ENVIRONMENT || "local",
    service: "greycollar-api",
  },
};

// Test functions
export function smoke() {
  // Basic health check and simple operations
  const response = http.get(
    `${__ENV.BASE_URL || "http://localhost:4000"}/metrics`
  );
  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);
}

export function load() {
  // Simulate normal user behavior
  const urls = [
    "/metrics",
    "/colleagues",
    "/tasks",
    "/projects",
    "/organizations",
  ];

  const randomUrl = urls[Math.floor(Math.random() * urls.length)];
  const response = http.get(
    `${__ENV.BASE_URL || "http://localhost:4000"}${randomUrl}`
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 1000ms": (r) => r.timings.duration < 1000,
  });

  sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
}

export function stress() {
  // Simulate high load scenarios
  const urls = [
    "/metrics",
    "/colleagues",
    "/tasks",
    "/projects",
    "/organizations",
    "/statistics",
    "/sessions",
  ];

  const randomUrl = urls[Math.floor(Math.random() * urls.length)];
  const response = http.get(
    `${__ENV.BASE_URL || "http://localhost:4000"}${randomUrl}`
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 2000ms": (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 2 + 0.5); // Random sleep between 0.5-2.5 seconds
}

export function spike() {
  // Simulate sudden traffic spikes
  const urls = [
    "/metrics",
    "/colleagues",
    "/tasks",
    "/projects",
    "/organizations",
    "/statistics",
    "/sessions",
    "/knowledge",
    "/messages",
  ];

  const randomUrl = urls[Math.floor(Math.random() * urls.length)];
  const response = http.get(
    `${__ENV.BASE_URL || "http://localhost:4000"}${randomUrl}`
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 3000ms": (r) => r.timings.duration < 3000,
  });

  sleep(Math.random() * 1 + 0.1); // Random sleep between 0.1-1.1 seconds
}

