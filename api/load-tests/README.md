# Load Testing with k6

This directory contains load testing scripts for the GreyCollar API using k6.

## Prerequisites

1. **Install k6**: Download and install k6 from [https://k6.io/docs/getting-started/installation/](https://k6.io/docs/getting-started/installation/)

   **Windows (using Chocolatey):**
   ```bash
   choco install k6
   ```

   **macOS (using Homebrew):**
   ```bash
   brew install k6
   ```

   **Linux:**
   ```bash
   sudo gpg -k
   sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   ```

2. **Start your API server**:
   ```bash
   npm run dev
   ```

## Test Types

### 1. Smoke Test (`smoke-test.js`)
- **Purpose**: Verify basic functionality under minimal load
- **Duration**: 1 minute
- **Users**: 1 virtual user
- **Use case**: Quick validation that the system is working

### 2. Load Test (`load-test.js`)
- **Purpose**: Test system behavior under expected load
- **Duration**: 9 minutes
- **Users**: Ramp up to 10 users, maintain, then ramp down
- **Use case**: Validate performance under normal conditions

### 3. Stress Test (`stress-test.js`)
- **Purpose**: Find the system's breaking point
- **Duration**: 9 minutes
- **Load**: Up to 20 requests per second
- **Use case**: Determine maximum capacity and identify bottlenecks

### 4. Spike Test (`spike-test.js`)
- **Purpose**: Test system behavior under sudden traffic spikes
- **Duration**: 1 minute 20 seconds
- **Users**: Spike to 100 users, maintain, then drop
- **Use case**: Validate system resilience during traffic surges

## Running Tests

### Basic Usage

```bash
# Run smoke test
k6 run load-tests/smoke-test.js

# Run load test
k6 run load-tests/load-test.js

# Run stress test
k6 run load-tests/stress-test.js

# Run spike test
k6 run load-tests/spike-test.js
```

### With Environment Variables

```bash
# Test against different environments
k6 run -e BASE_URL=http://localhost:4000 -e ENVIRONMENT=local load-tests/load-test.js

# Test against staging
k6 run -e BASE_URL=https://staging-api.greycollar.ai -e ENVIRONMENT=staging load-tests/load-test.js

# Test against production
k6 run -e BASE_URL=https://api.greycollar.ai -e ENVIRONMENT=production load-tests/load-test.js
```

### Using the Main Configuration

```bash
# Run all test scenarios from the main config
k6 run k6.config.js

# Run specific scenario
k6 run --env SCENARIO=smoke k6.config.js
k6 run --env SCENARIO=load k6.config.js
k6 run --env SCENARIO=stress k6.config.js
k6 run --env SCENARIO=spike k6.config.js
```

## Test Results

k6 provides comprehensive metrics including:

- **HTTP Request Duration**: Response time percentiles (p50, p90, p95, p99)
- **HTTP Request Rate**: Requests per second
- **HTTP Request Failures**: Error rate
- **Virtual Users**: Active virtual users over time
- **Data Transfer**: Bytes sent/received

## Thresholds

Each test has defined thresholds that must be met for the test to pass:

- **Smoke Test**: 95% of requests < 200ms, error rate < 1%
- **Load Test**: 95% of requests < 1000ms, error rate < 5%, > 50 req/s
- **Stress Test**: 95% of requests < 2000ms, error rate < 10%, > 100 req/s
- **Spike Test**: 95% of requests < 3000ms, error rate < 15%, > 200 req/s

## Customization

### Modifying Test Parameters

Edit the `options` object in each test file to adjust:
- Number of virtual users
- Test duration
- Ramp-up/ramp-down patterns
- Thresholds

### Adding New Endpoints

Update the `endpoints` array in each test file to include new API endpoints.

### Custom Metrics

Add custom metrics using k6's built-in metric types:
```javascript
import { Rate, Trend, Counter } from 'k6/metrics';

const customMetric = new Trend('custom_metric_name');
customMetric.add(value);
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Load Tests
on: [push, pull_request]
jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      - name: Run Smoke Test
        run: k6 run load-tests/smoke-test.js
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure your API server is running
2. **High Error Rate**: Check server logs for errors
3. **Slow Response Times**: Monitor server resources (CPU, memory, database)
4. **Test Timeout**: Increase test duration or reduce load

### Performance Tuning

- Monitor server metrics during tests
- Use k6's built-in profiling for detailed analysis
- Consider running tests against different environments
- Analyze results to identify bottlenecks

## Additional Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 Examples](https://github.com/grafana/k6-examples)
- [Load Testing Best Practices](https://k6.io/docs/testing-guides/)
- [k6 Cloud](https://k6.io/cloud/) for distributed load testing
