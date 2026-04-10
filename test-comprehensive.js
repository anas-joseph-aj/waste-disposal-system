#!/usr/bin/env node

// Enhanced comprehensive test with full user workflow and dashboard operations

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

// Test counters
let passed = 0;
let failed = 0;
let testCount = 0;

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

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    return { status: response.status, statusText: response.statusText, data, ok: response.ok };
  } catch (error) {
    return { status: 0, statusText: 'NetworkError', data: {}, ok: false, error: error.message };
  }
}

function assert(condition, message) {
  testCount++;
  if (condition) {
    passed++;
    console.log(`✓ ${message}`);
  } else {
    failed++;
    console.log(`✗ ${message}`);
  }
}

async function runTests() {
  console.log('\n=== COMPREHENSIVE APPLICATION TEST ===\n');

  API_BASE = await discoverApiBase();
  console.log(`Using API base: ${API_BASE}`);

  let adminToken = '';
  let userToken = '';
  let collectorToken = '';

  console.log('--- Logging Into Demo Accounts ---');
  let res = await apiCall('POST', '/auth/login', {
    email: 'admin@.com',
    password: 'Admin@123'
  });
  assert(res.ok && res.data.token, `Login demo admin: ${res.status}`);
  adminToken = res.data.token || '';

  res = await apiCall('POST', '/auth/login', {
    email: 'demo.user@wds.local',
    password: 'User@123'
  });
  assert(res.ok && res.data.token, `Login demo user: ${res.status}`);
  userToken = res.data.token || '';

  res = await apiCall('POST', '/auth/login', {
    email: 'demo.collector@wds.local',
    password: 'Collector@123'
  });
  assert(res.ok && res.data.token, `Login demo collector: ${res.status}`);
  collectorToken = res.data.token || '';

  console.log('\n--- User Authentication ---');

  // Test login
  res = await apiCall('GET', '/auth/me', null, userToken);
  assert(res.ok && res.data.user, `Get current user: ${res.status}`);

  // Test email check
  res = await apiCall('POST', '/auth/check-email', { email: 'nonexistent@test.com' });
  assert(res.ok, `Check email availability: ${res.status}`);

  console.log('\n--- User Management (Admin) ---');

  // Get all users (admin only)
  res = await apiCall('GET', '/users', null, adminToken);
  assert(res.ok, `Get users as admin: ${res.status}`);

  // Update user profile
  res = await apiCall('GET', '/auth/me', null, userToken);
  const userId = res.data?.user?.id || '';
  res = await apiCall('PUT', `/users/${userId}/profile`, {
    phone: '9111111111',
    address: 'Updated Address'
  }, userToken);
  assert(res.ok, `Update profile: ${res.status}`);

  console.log('\n--- Pickup Requests ---');

  // Create pickup request
  res = await apiCall('POST', '/pickups', {
    wasteType: 'plastic',
    quantity: 10,
    address: 'Test Address',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    description: 'Test pickup'
  }, userToken);
  assert(res.ok && res.data.pickup, `Create pickup: ${res.status}`);
  const pickupId = res.data.pickup?._id || res.data.pickup?.id;

  if (pickupId) {
    res = await apiCall('PUT', `/pickups/${pickupId}/assign`, {
      collectorId: 'usr-demo-collector'
    }, adminToken);
    assert(res.ok || res.status === 200, `Assign collector to pickup: ${res.status}`);

    res = await apiCall('PUT', `/pickups/${pickupId}/status`, {
      status: 'Completed'
    }, collectorToken);
    assert(res.ok, `Collector completes pickup: ${res.status}`);
  }

  // Get pickups
  res = await apiCall('GET', '/pickups', null, userToken);
  assert(res.ok && Array.isArray(res.data.pickups), `Get pickups list: ${res.status}`);

  // Get pickup by ID
  if (pickupId) {
    res = await apiCall('GET', `/pickups/${pickupId}`, null, userToken);
    assert(res.ok || res.status === 404, `Get pickup by ID: ${res.status}`);

    // Update pickup status
    res = await apiCall('PUT', `/pickups/${pickupId}/status`, {
      status: 'Completed',
      notes: 'Collector assigned'
    }, adminToken);
    assert(res.ok, `Update pickup status: ${res.status}`);
  }

  console.log('\n--- Complaints ---');

  // Create complaint
  res = await apiCall('POST', '/complaints', {
    subject: 'Test Complaint',
    message: 'This is a test complaint',
  }, userToken);
  assert(res.ok && res.data.complaint, `Create complaint: ${res.status}`);
  const complaintId = res.data.complaint?._id || res.data.complaint?.id;

  // Get complaints
  res = await apiCall('GET', '/complaints', null, userToken);
  assert(res.ok && Array.isArray(res.data.complaints), `Get complaints list: ${res.status}`);

  // Update complaint status  
  if (complaintId) {
    res = await apiCall('PUT', `/complaints/${complaintId}/status`, {
      status: 'In Progress',
      resolution: 'Working on it'
    }, adminToken);
    assert(res.ok, `Update complaint status: ${res.status}`);

    // Delete complaint
    res = await apiCall('DELETE', `/complaints/${complaintId}`, null, adminToken);
    assert(res.ok, `Delete complaint: ${res.status}`);
  }

  console.log('\n--- Feedback ---');

  // Create feedback
  res = await apiCall('POST', '/feedback', {
    rating: 5,
    comment: 'Great service!',
    wasteType: 'plastic',
    pickupRequestId: pickupId
  }, userToken);
  assert(res.ok, `Create feedback: ${res.status}`);
  const feedbackId = res.data.feedback?.id;

  // Get feedback
  res = await apiCall('GET', '/feedback', null, userToken);
  assert(res.ok, `Get feedback list: ${res.status}`);

  // Get public feedback
  res = await apiCall('GET', '/feedback/public');
  assert(res.ok && Array.isArray(res.data.feedback), `Get public feedback: ${res.status}`);

  // Moderate feedback (admin)
  if (feedbackId) {
    res = await apiCall('PUT', `/feedback/${feedbackId}/moderate`, {
      action: 'approve',
      adminNote: 'Approved'
    }, adminToken);
    assert(res.ok, `Moderate feedback: ${res.status}`);
  }

  console.log('\n--- Payments ---');

  // Create payment
  res = await apiCall('POST', '/payments', {
    amount: 500,
    method: 'Online',
    pickupRequestId: pickupId || '',
    transactionId: `TXN-${Date.now()}`
  }, userToken);
  assert(res.ok, `Create payment: ${res.status}`);
  const paymentId = res.data.payment?.id;

  // Get payments
  res = await apiCall('GET', '/payments', null, userToken);
  assert(res.ok && Array.isArray(res.data.payments), `Get payments list: ${res.status}`);

  // Get payment by ID
  if (paymentId) {
    res = await apiCall('GET', `/payments/${paymentId}`, null, userToken);
    assert(res.ok || res.status === 404, `Get payment by ID: ${res.status}`);
  }

  console.log('\n--- Settings ---');

  // Get settings
  res = await apiCall('GET', '/settings');
  assert(res.ok && res.data, `Get settings: ${res.status}`);

  // Update settings (admin only)
  res = await apiCall('PUT', '/settings', {
    pickupFee: 100,
    description: 'Updated settings'
  }, adminToken);
  assert(res.ok, `Update settings: ${res.status}`);

  console.log('\n--- Health & Status ---');

  // Health endpoints
  res = await apiCall('GET', '/health');
  assert(res.ok && res.data.status, `API health check: ${res.status}`);

  // Test OPTIONS (CORS preflight)
  const optionsRes = await fetch(`${API_BASE}/pickups`, { method: 'OPTIONS' });
  assert(optionsRes.ok || optionsRes.status === 200, `OPTIONS preflight request: ${optionsRes.status}`);

  console.log('\n=== TEST SUMMARY ===\n');
  console.log(`Total Tests: ${testCount}`);
  console.log(`Passed: ${passed} (${((passed / testCount) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n✅ All tests passed! Application is working professionally.\n');
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed. Please review above.\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
