#!/usr/bin/env node

// Comprehensive test of the full user workflow
// Tests: Register -> Login -> Create Pickup -> View Complaints -> Submit Feedback -> Logout

const API_BASE = 'http://localhost:5001/api';

const tests = [];
let currentToken = '';

async function test(name, method, endpoint, body = null, requireAuth = true) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (requireAuth && currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    const result = {
      test: name,
      method,
      endpoint,
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      error: response.ok ? null : (data.message || data.error || `${response.status} ${response.statusText}`)
    };

    tests.push(result);

    const statusLabel = response.ok ? '✓' : '✗';
    const emoji = response.status === 405 ? '⚠️ ' : '';
    console.log(`${emoji}${statusLabel} [${response.status}] ${method} ${endpoint} - ${name}`);

    if (!response.ok) {
      console.log(`    Error: ${result.error}`);
    }

    return { data, response };
  } catch (error) {
    const result = {
      test: name,
      method,
      endpoint,
      status: 0,
      statusText: 'Network Error',
      success: false,
      error: error.message
    };

    tests.push(result);
    console.log(`✗ NETWORK ERROR ${method} ${endpoint} - ${name}`);
    console.log(`  Error: ${error.message}`);
    return { data: null, response: null };
  }
}

async function runTests() {
  console.log('\n=== WASTE DISPOSAL SYSTEM - FULL WORKFLOW TEST ===\n');

  // 1. Check health
  console.log('--- Health Check ---');
  await test('Health Check', 'GET', '/health', null, false);

  // 2. Register a test user
  console.log('\n--- User Registration ---');
  const testEmail = `test-${Date.now()}@example.com`;
  const registerResult = await test('Register User', 'POST', '/auth/register', {
    name: 'Test User',
    email: testEmail,
    phone: '9876543210',
    password: 'TestPassword@123',
    address: '123 Test Street'
  }, false);

  if (registerResult.data?.token) {
    currentToken = registerResult.data.token;
    console.log(`  Token set: ${currentToken.slice(0, 20)}...`);
  }

  // 3. Get current user
  console.log('\n--- Current User ---');
  await test('Get Current User', 'GET', '/auth/me');

  // 4. Get all users (admin only)
  console.log('\n--- User Management ---');
  await test('Get All Users', 'GET', '/users');
  await test('Get User by ID (me)', 'GET', '/users/me');

  // 5. Create a pickup request
  console.log('\n--- Pickup Management ---');
  const pickupResult = await test('Create Pickup Request', 'POST', '/pickups', {
    location: 'Home',
    wasteType: 'plastic',
    quantity: 5,
    description: 'Test pickup request'
  });

  let pickupId = null;
  if (pickupResult.data?.pickup?._id) {
    pickupId = pickupResult.data.pickup._id;
  }

  if (pickupId) {
    await test('Get Pickups', 'GET', '/pickups');
    await test('Get Pickup by ID', 'GET', `/pickups/${pickupId}`);
    await test('Update Pickup Status', 'PUT', `/pickups/${pickupId}/status`, { status: 'completed' });
  }

  // 6. Create complaint
  console.log('\n--- Complaint Management ---');
  const complaintResult = await test('Create Complaint', 'POST', '/complaints', {
    description: 'Test complaint',
    status: 'Open'
  });

  if (complaintResult.data?.complaint?._id) {
    const complaintId = complaintResult.data.complaint._id;
    await test('Get Complaints', 'GET', '/complaints');
    await test('Update Complaint Status', 'PUT', `/complaints/${complaintId}/status`, {
      status: 'Resolved',
      resolution: 'Test resolution'
    });
  } else {
    await test('Get Complaints', 'GET', '/complaints');
  }

  // 7. Payments
  console.log('\n--- Payment Management ---');
  await test('Get Payments', 'GET', '/payments');

  // 8. Feedback
  console.log('\n--- Feedback Management ---');
  const feedbackResult = await test('Create Feedback', 'POST', '/feedback', {
    rating: 5,
    comment: 'Test feedback',
    wasteType: 'plastic'
  });

  await test('Get Public Feedback', 'GET', '/feedback/public', null, false);

  if (feedbackResult.data?.feedback?._id) {
    const feedbackId = feedbackResult.data.feedback._id;
    await test('Moderate Feedback', 'PUT', `/feedback/${feedbackId}/moderate`, {
      action: 'approve',
      adminNote: 'Test approved'
    });
  }

  // 9. Settings
  console.log('\n--- Settings ---');
  await test('Get Settings', 'GET', '/settings');

  // 10. Login with registered user
  console.log('\n--- Re-Authentication ---');
  const loginResult = await test('Login', 'POST', '/auth/login', {
    email: testEmail,
    password: 'TestPassword@123'
  }, false);

  if (loginResult.data?.token) {
    currentToken = loginResult.data.token;
    console.log(`  New token set: ${currentToken.slice(0, 20)}...`);
  }

  // Summary
  console.log('\n=== TEST SUMMARY ===\n');
  const passed = tests.filter(t => t.success).length;
  const failed = tests.filter(t => !t.success).length;
  const errors405 = tests.filter(t => t.status === 405);

  console.log(`Total: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (errors405.length > 0) {
    console.log(`\n⚠️  405 ERRORS FOUND (${errors405.length}):`);
    errors405.forEach(t => {
      console.log(`   - ${t.method} ${t.endpoint} (${t.test})`);
    });
  } else {
    console.log('\n✓ No 405 Method Not Allowed errors found');
  }

  const errorSummary = {};
  tests.filter(t => !t.success).forEach(t => {
    if (!errorSummary[t.status]) {
      errorSummary[t.status] = [];
    }
    errorSummary[t.status].push(`${t.method} ${t.endpoint}`);
  });

  if (Object.keys(errorSummary).length > 0) {
    console.log('\nOther Error Status Codes:');
    Object.entries(errorSummary).forEach(([status, endpoints]) => {
      console.log(`  ${status}: ${endpoints.length} endpoint(s)`);
    });
  }
  
  console.log('\n');
}

runTests().catch(console.error);
