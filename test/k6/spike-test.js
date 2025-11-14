import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');
export let requests = new Counter('total_requests');

export let options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp-up to 10 users
    { duration: '30s', target: 10 },  // Stay at 10 users
    { duration: '30s', target: 500 }, // Spike to 500 users
    { duration: '1m', target: 500 },  // Stay at 500 users for 1 minute
    { duration: '30s', target: 10 },  // Drop back to 10 users
    { duration: '1m', target: 10 },   // Recover at 10 users
    { duration: '30s', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests must complete below 5s
    http_req_failed: ['rate<0.25'],    // Error rate must be below 25% for spike test
    errors: ['rate<0.25'],             // Custom error rate must be below 25%
  },
};

const BASE_URL = 'http://localhost:4567';

export default function () {
  // Focus on the most commonly accessed endpoints during spike

  // Homepage - most likely to be hit during traffic spikes
  let response = http.get(`${BASE_URL}/`);
  requests.add(1);
  let success = check(response, {
    'homepage status check': (r) => r.status === 200,
    'homepage response time': (r) => r.timings.duration < 5000,
  });
  errorRate.add(!success);

  sleep(0.5);

  // API endpoints that are frequently called
  response = http.get(`${BASE_URL}/api/categories`);
  requests.add(1);
  success = check(response, {
    'categories API status check': (r) => r.status === 200,
    'categories API response time': (r) => r.timings.duration < 3000,
  });
  errorRate.add(!success);

  sleep(0.5);

  // Recent topics - commonly accessed
  response = http.get(`${BASE_URL}/api/recent`);
  requests.add(1);
  success = check(response, {
    'recent API status check': (r) => r.status === 200,
    'recent API response time': (r) => r.timings.duration < 3000,
  });
  errorRate.add(!success);

  // Shorter sleep during spike test to simulate rapid requests
  sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5-1.5 seconds
}

export function handleSummary(data) {
  return {
    'test/k6/spike-summary.json': JSON.stringify(data, null, 2),
  };
}