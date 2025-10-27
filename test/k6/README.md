# NodeBB k6 Load Testing

This directory contains k6 load testing scripts for the NodeBB API.

## Prerequisites

1. Make sure NodeBB is running (usually on `http://localhost:4567`)
2. k6 is installed (binary is available in the project root as `./k6`)

## Test Scripts

### 1. Basic Load Test (`basic-load-test.js`)
- **Purpose**: Basic functionality and performance validation
- **Load Pattern**: 10-20 users over 4 minutes
- **Endpoints Tested**: Homepage, categories, recent topics, popular topics
- **Thresholds**: 95% of requests < 2s, error rate < 10%

### 2. Stress Test (`stress-test.js`)
- **Purpose**: Test system behavior under sustained high load
- **Load Pattern**: Ramps up to 200 concurrent users over 21 minutes
- **User Behaviors**: Simulates different user types (browser, reader, searcher)
- **Thresholds**: 95% of requests < 3s, error rate < 15%

### 3. Spike Test (`spike-test.js`)
- **Purpose**: Test system behavior under sudden traffic spikes
- **Load Pattern**: Sudden spike from 10 to 500 users
- **Focus**: Most commonly accessed endpoints
- **Thresholds**: 95% of requests < 5s, error rate < 25%

## Running the Tests

### From project root:

```bash
# Basic load test
./k6 run test/k6/basic-load-test.js

# Stress test
./k6 run test/k6/stress-test.js

# Spike test
./k6 run test/k6/spike-test.js
```

### With different configurations:

```bash
# Run with custom duration
./k6 run --duration 30s test/k6/basic-load-test.js

# Run with custom virtual users
./k6 run --vus 5 --duration 30s test/k6/basic-load-test.js

# Run with custom base URL
./k6 run -e BASE_URL=http://localhost:3000 test/k6/basic-load-test.js
```

## Test Results

Test results are automatically saved as JSON files:
- `test/k6/summary.json` - Basic load test results
- `test/k6/stress-summary.json` - Stress test results
- `test/k6/spike-summary.json` - Spike test results

## Interpreting Results

### Key Metrics:
- **http_req_duration**: Request response times
- **http_req_failed**: Failed request rate
- **http_reqs**: Total number of requests
- **iterations**: Number of test iterations completed
- **vus**: Virtual users active

### Thresholds:
- All tests should pass their defined thresholds
- Failed thresholds indicate performance issues
- Monitor error rates and response times

## Customization

### Modify Base URL:
Edit the `BASE_URL` constant in each test file or use environment variables:

```bash
./k6 run -e BASE_URL=http://your-nodebb-instance.com test/k6/basic-load-test.js
```

### Adjust Load Patterns:
Modify the `options.stages` array in each test file to change the load pattern.

### Add New Endpoints:
Add new HTTP requests and checks in the default function of each test file.

## Best Practices

1. **Start Small**: Begin with the basic load test
2. **Monitor Resources**: Watch server CPU, memory, and database performance
3. **Gradual Increase**: Gradually increase load to find breaking points
4. **Real Data**: Test with realistic data and user scenarios
5. **Baseline**: Establish performance baselines before making changes