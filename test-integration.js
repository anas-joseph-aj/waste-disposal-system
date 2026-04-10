#!/usr/bin/env node

/**
 * Comprehensive Integration Test Suite
 * Tests all API endpoints and features to ensure everything works correctly
 */

const API_PORTS = Array.from({ length: 11 }, (_, index) => 5000 + index);

async function discoverApiBase() {
  let selected = '';

  for (const port of API_PORTS) {
    const candidate = `http://localhost:${port}/api`;
    try {
      const response = await fetch(`${candidate}/health`);
      if (!response.ok) {
        continue;
      }

      const data = await response.json().catch(() => null);
      if (data && String(data.status || '').toLowerCase() === 'ok') {
        selected = candidate;
      }
    } catch {
      continue;
    }
  }

  if (selected) {
    return selected;
  }

  throw new Error('Unable to discover a live API base on ports 5000-5010.');
}

let API_BASE = '';

const TEST_STATS = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
};

async function apiCall(method, endpoint, body = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data,
    error: !response.ok ? data.message || `HTTP ${response.status}` : null
  };
}

function assert(condition, message) {
  TEST_STATS.total++;
  
  if (!condition) {
    TEST_STATS.failed++;
    TEST_STATS.tests.push(`❌ ${message}`);
    console.error(`FAIL: ${message}`);
  } else {
    TEST_STATS.passed++;
    TEST_STATS.tests.push(`✅ ${message}`);
    console.log(`PASS: ${message}`);
  }
}

async function runTests() {
  console.log('\n=== WASTE DISPOSAL SYSTEM - INTEGRATION TEST SUITE ===\n');
  console.log(`API Base: ${API_BASE}\n`);

  let adminToken = '';
  let userToken = '';
  let collectorToken = '';

  // Test 1: Auth Endpoints
  console.log('\n--- Authentication Tests ---');
  
  const registerData = {
    name: 'Test User',
    email: `testuser${Date.now()}@test.com`,
    phone: '9876543210',
    password: 'TestPassword@123'
  };

  let res = await apiCall('POST', '/auth/register', registerData);
  assert(res.ok, `Register new user: ${res.status}`);
  userToken = res.data?.token || '';

  let loginRes = await apiCall('POST', '/auth/login', {
    email: registerData.email,
    password: registerData.password
  });
  assert(loginRes.ok && loginRes.data?.token, `Login with registered user: ${loginRes.status}`);
  userToken = loginRes.data?.token || userToken;

  // Test 2: Admin/Collector Login (demo accounts)
  console.log('\n--- Admin/Collector Authentication ---');
  
  const adminLoginRes = await apiCall('POST', '/auth/login', {
    email: 'admin@.com',
    password: 'Admin@123'
  });
  assert(adminLoginRes.ok, `Admin login: ${adminLoginRes.status}`);
  adminToken = adminLoginRes.data?.token || '';

  const collectorLoginRes = await apiCall('POST', '/auth/login', {
    email: 'demo.collector@wds.local',
    password: 'Collector@123'
  });
  assert(collectorLoginRes.ok, `Collector login: ${collectorLoginRes.status}`);
  collectorToken = collectorLoginRes.data?.token || '';
  const collectorId = collectorLoginRes.data?.user?.id || '';

  // Test 3: Protected User Endpoints
  console.log('\n--- Protected User Endpoints ---');

  res = await apiCall('GET', '/auth/me', null, userToken);
  assert(res.ok, `Get current user: ${res.status}`);

  // Test 4: Email Check
  console.log('\n--- Email Validation ---');

  res = await apiCall('POST', '/auth/check-email', { email: 'nonexistent@test.com' });
  assert(res.ok, `Check email availability: ${res.status}`);

  // Test 5: Pickup Endpoints
  console.log('\n--- Pickup Management ---');

  const pickupData = {
    wasteType: 'Organic',
    quantity: 5,
    address: 'Test Address, City',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: 'Test pickup request'
  };

  res = await apiCall('POST', '/pickups', pickupData, userToken);
  assert(res.ok, `Create pickup request: ${res.status}`);
  const pickupId = res.data?.pickup?.id || '';

  res = await apiCall('GET', '/pickups', null, userToken);
  assert(res.ok && Array.isArray(res.data?.pickups), `Get pickups list: ${res.status}`);

  if (pickupId) {
    res = await apiCall('GET', `/pickups/${pickupId}`, null, userToken);
    assert(res.ok, `Get pickup by ID: ${res.status}`);

    if (adminToken) {
      const collectorsRes = await apiCall('GET', '/users/collectors', null, adminToken);
      const fallbackCollectorId = collectorsRes.data?.collectors?.[0]?.id || '';
      const assignedCollectorId = collectorId || fallbackCollectorId;
      assert(collectorsRes.ok && Boolean(assignedCollectorId), `Get collectors for assignment: ${collectorsRes.status}`);

      if (assignedCollectorId) {
        const assignRes = await apiCall('PUT', `/pickups/${pickupId}/assign`, { collectorId: assignedCollectorId }, adminToken);
        assert(assignRes.ok, `Assign collector to pickup: ${assignRes.status}`);
      }
    }

    if (collectorToken) {
      const completeRes = await apiCall('PUT', `/pickups/${pickupId}/status`, { status: 'Completed' }, collectorToken);
      assert(completeRes.ok, `Mark pickup completed: ${completeRes.status}`);
    }
  }

  // Test 6: Complaint Endpoints
  console.log('\n--- Complaint Management ---');

  const complaintData = {
    subject: 'Test Complaint',
    message: 'This is a test complaint',
    priority: 'High'
  };

  res = await apiCall('POST', '/complaints', complaintData, userToken);
  assert(res.ok, `Create complaint: ${res.status}`);
  const complaintId = res.data?.complaint?.id || '';

  res = await apiCall('GET', '/complaints', null, userToken);
  assert(res.ok && Array.isArray(res.data?.complaints), `Get complaints list: ${res.status}`);

  // Test 7: Payment Endpoints
  console.log('\n--- Payment Processing ---');

  const paymentData = {
    amount: 100,
    method: 'Card',
    pickupRequestId: ''
  };

  res = await apiCall('POST', '/payments', paymentData, userToken);
  assert(res.ok, `Create payment: ${res.status}`);

  res = await apiCall('GET', '/payments', null, userToken);
  assert(res.ok && Array.isArray(res.data?.payments), `Get payments list: ${res.status}`);

  // Test 8: Feedback Endpoints
  console.log('\n--- Feedback Management ---');

  const feedbackData = {
    pickupRequestId: pickupId,
    rating: 5,
    comment: 'Great service!'
  };

  res = await apiCall('POST', '/feedback', feedbackData, userToken);
  assert(res.ok, `Submit feedback: ${res.status}`);

  res = await apiCall('GET', '/feedback/public', null);
  assert(res.ok && Array.isArray(res.data?.feedback), `Get public feedback: ${res.status}`);

  // Test 9: Settings Endpoints
  console.log('\n--- System Settings ---');

  res = await apiCall('GET', '/settings', null);
  assert(res.ok, `Get system settings: ${res.status}`);

  if (adminToken) {
    res = await apiCall('PUT', '/settings', { pickupFee: 100 }, adminToken);
    assert(res.ok, `Update system settings (admin): ${res.status}`);
  }

  // Test 10: Chatbot Endpoints
  console.log('\n--- Chatbot Features ---');

  res = await apiCall('POST', '/chatbot/message', {
    message: 'I want to report a complaint',
    language: 'en'
  }, userToken);
  assert(res.ok, `Send chatbot message: ${res.status}`);

  // Test 11: Health Check
  console.log('\n--- Health Checks ---');

  res = await apiCall('GET', '/health', null);
  assert(res.ok, `API health check: ${res.status}`);

  // Print Summary
  console.log('\n\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${TEST_STATS.total}`);
  console.log(`Passed: ${TEST_STATS.passed} ✅`);
  console.log(`Failed: ${TEST_STATS.failed} ❌`);
  console.log(`Success Rate: ${((TEST_STATS.passed / TEST_STATS.total) * 100).toFixed(2)}%\n`);

  if (TEST_STATS.failed === 0) {
    console.log('🎉 All tests passed! Application is fully functional.\n');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Main execution
(async () => {
  try {
    console.log('Discovering API base...');
    API_BASE = await discoverApiBase();
    console.log(`Found API at: ${API_BASE}`);
    await runTests();
  } catch (error) {
    console.error('Test execution failed:', error.message);
    process.exit(1);
  }
})();
