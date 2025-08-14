// Example environment configuration for k6 load tests
// Copy this file and modify for your specific environments

export const environments = {
  local: {
    BASE_URL: "http://localhost:4000",
    ENVIRONMENT: "local",
    TIMEOUT: "30s",
    THRESHOLDS: {
      http_req_duration: ["p(95)<1000"],
      http_req_failed: ["rate<0.05"],
    },
  },

  land: {
    BASE_URL: "https://land.greycollar.ai/api",
    ENVIRONMENT: "land",
    TIMEOUT: "60s",
    THRESHOLDS: {
      http_req_duration: ["p(95)<1500"],
      http_req_failed: ["rate<0.03"],
    },
  },

  production: {
    BASE_URL: "https://api.greycollar.ai",
    ENVIRONMENT: "production",
    TIMEOUT: "120s",
    THRESHOLDS: {
      http_req_duration: ["p(95)<800"],
      http_req_failed: ["rate<0.01"],
    },
  },

  // Custom environment for testing specific scenarios
  performance: {
    BASE_URL: "http://localhost:4000",
    ENVIRONMENT: "performance",
    TIMEOUT: "300s",
    THRESHOLDS: {
      http_req_duration: ["p(95)<500"],
      http_req_failed: ["rate<0.001"],
      http_reqs: ["rate>200"],
    },
  },
};

// Usage example:
// k6 run -e BASE_URL=https://staging-api.greycollar.ai -e ENVIRONMENT=staging load-tests/load-test.js

