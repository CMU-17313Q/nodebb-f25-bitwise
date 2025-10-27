import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up to 10 users over 30 seconds
    { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
    { duration: '30s', target: 20 }, // Ramp-up to 20 users over 30 seconds
    { duration: '2m', target: 20 },  // Stay at 20 users for 2 minutes
    { duration: '30s', target: 0 },  // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate must be below 10%
  },
};

const BASE_URL = 'http://localhost:4567';

export default function () {
  // Test 1: Homepage
  let response = http.get(`${BASE_URL}/`);
  let success = check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 2s': (r) => r.timings.duration < 2000,
    'homepage contains NodeBB': (r) => r.body.includes('NodeBB') || r.body.includes('nodebb'),
  });
  errorRate.add(!success);

  sleep(1);

  // Test 2: Categories API
  response = http.get(`${BASE_URL}/api/categories`);
  success = check(response, {
    'categories API status is 200': (r) => r.status === 200,
    'categories API response time < 1s': (r) => r.timings.duration < 1000,
    'categories API returns JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
  });
  errorRate.add(!success);

  sleep(1);

  // Test 3: Recent topics API
  response = http.get(`${BASE_URL}/api/recent`);
  success = check(response, {
    'recent topics API status is 200': (r) => r.status === 200,
    'recent topics API response time < 1.5s': (r) => r.timings.duration < 1500,
  });
  errorRate.add(!success);

  sleep(1);

  // Test 4: Popular topics API
  response = http.get(`${BASE_URL}/api/popular`);
  success = check(response, {
    'popular topics API status is 200': (r) => r.status === 200,
    'popular topics API response time < 1.5s': (r) => r.timings.duration < 1500,
  });
  errorRate.add(!success);

  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

export function handleSummary(data) {
  return {
    'test/k6/summary.json': JSON.stringify(data, null, 2),
  };
}