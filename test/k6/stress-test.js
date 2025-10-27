import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');
export let requests = new Counter('total_requests');

export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp-up to 50 users over 2 minutes
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },  // Ramp-up to 100 users over 2 minutes
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 },  // Ramp-up to 200 users over 2 minutes (stress test)
    { duration: '5m', target: 200 },  // Stay at 200 users for 5 minutes
    { duration: '3m', target: 0 },    // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests must complete below 3s
    http_req_failed: ['rate<0.15'],    // Error rate must be below 15% for stress test
    errors: ['rate<0.15'],             // Custom error rate must be below 15%
  },
};

const BASE_URL = 'http://localhost:4567';

// Simulated user behavior patterns
const userBehaviors = [
  'browser',    // Casual browsing
  'reader',     // Reading posts/topics
  'searcher',   // Using search functionality
];

function casualBrowser() {
  // Simulate a user casually browsing the forum
  let response = http.get(`${BASE_URL}/`);
  requests.add(1);
  let success = check(response, {
    'homepage loaded': (r) => r.status === 200,
  });
  errorRate.add(!success);
  sleep(2);

  response = http.get(`${BASE_URL}/api/categories`);
  requests.add(1);
  success = check(response, {
    'categories loaded': (r) => r.status === 200,
  });
  errorRate.add(!success);
  sleep(3);
}

function activeReader() {
  // Simulate a user actively reading content
  let response = http.get(`${BASE_URL}/api/recent`);
  requests.add(1);
  let success = check(response, {
    'recent topics loaded': (r) => r.status === 200,
  });
  errorRate.add(!success);
  sleep(1);

  response = http.get(`${BASE_URL}/api/popular`);
  requests.add(1);
  success = check(response, {
    'popular topics loaded': (r) => r.status === 200,
  });
  errorRate.add(!success);
  sleep(2);

  // Try to access a specific topic (this might fail if no topics exist)
  response = http.get(`${BASE_URL}/api/topic/1`);
  requests.add(1);
  check(response, {
    'topic access attempted': (r) => r.status === 200 || r.status === 404,
  });
  sleep(4);
}

function searchUser() {
  // Simulate a user using search functionality
  let response = http.get(`${BASE_URL}/api/search?term=test`);
  requests.add(1);
  let success = check(response, {
    'search executed': (r) => r.status === 200 || r.status === 404,
  });
  errorRate.add(!success);
  sleep(2);

  response = http.get(`${BASE_URL}/api/users`);
  requests.add(1);
  success = check(response, {
    'users page loaded': (r) => r.status === 200,
  });
  errorRate.add(!success);
  sleep(3);
}

export default function () {
  // Randomly select user behavior
  const behavior = userBehaviors[Math.floor(Math.random() * userBehaviors.length)];

  switch (behavior) {
    case 'browser':
      casualBrowser();
      break;
    case 'reader':
      activeReader();
      break;
    case 'searcher':
      searchUser();
      break;
  }

  sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
}

export function handleSummary(data) {
  return {
    'test/k6/stress-summary.json': JSON.stringify(data, null, 2),
  };
}