import { getActiveSessionUser, logout } from './services/auth.js';
import { getAuthToken, userAPI, pickupAPI, complaintAPI, paymentAPI, settingsAPI, feedbackAPI } from './services/api.js';

let state = {
  users: [],
  collectors: [],
  pickups: [],
  complaints: [],
  payments: []
};

let currentPickupFee = 50;
const ADMIN_REJECTION_NOTIFICATIONS_KEY = 'wds_admin_seen_rejection_notifications_v1';
let wasteTypeChartRef = null;
let paymentTypeChartRef = null;
let pickupStatusChartRef = null;


function showNotice(type, message) {
  const node = document.getElementById('adminNotice');
  if (!node) return;
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function getSeenRejectionNotifications() {
  try {
    const raw = localStorage.getItem(ADMIN_REJECTION_NOTIFICATIONS_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSeenRejectionNotifications(values = []) {
  localStorage.setItem(ADMIN_REJECTION_NOTIFICATIONS_KEY, JSON.stringify(values.slice(-200)));
}

function parseCollectorRejectionEvents(pickups = []) {
  const events = [];

  for (const pickup of pickups) {
    const notes = String(pickup?.notes || '');
    if (!notes) continue;

    const lines = notes.split('\n').map((line) => String(line || '').trim()).filter(Boolean);
    for (const line of lines) {
      if (!line.startsWith('[Collector Rejected]')) continue;

      const content = line.replace('[Collector Rejected]', '').trim();
      const byMatch = /\|\s*by:([^\s-]+)/i.exec(content);
      const reasonMatch = /\s-\s(.+)$/.exec(content);
      const timestampMatch = /^(\d{4}-\d{2}-\d{2}T[^|\s]+)/.exec(content);

      const rejectedBy = byMatch ? byMatch[1] : 'collector';
      const reason = reasonMatch ? reasonMatch[1] : 'No reason provided';
      const timestamp = timestampMatch ? timestampMatch[1] : '';
      const eventId = `${pickup.id}::${timestamp || content}`;

      events.push({
        id: eventId,
        pickupId: pickup.id,
        rejectedBy,
        reason
      });
    }
  }

  return events;
}

function notifyAdminOnCollectorRejections(pickups = []) {
  const events = parseCollectorRejectionEvents(pickups);
  if (!events.length) return;

  const seen = new Set(getSeenRejectionNotifications());
  const unseen = events.filter((event) => !seen.has(event.id));
  if (!unseen.length) return;

  unseen.forEach((event) => {
    showNotice('error', `Collector ${event.rejectedBy} rejected request ${event.pickupId}. Reason: ${event.reason}`);
    seen.add(event.id);
  });

  setSeenRejectionNotifications(Array.from(seen));
}

function normalizePaymentMethodLabel(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'Unknown';
  if (['upi', 'upi payment'].includes(raw)) return 'UPI';
  if (['net banking', 'bank payment', 'bank'].includes(raw)) return 'Net Banking';
  if (['credit/debit card', 'card payment', 'card', 'credit card', 'debit card'].includes(raw)) return 'Card';
  if (['cash', 'cash on delivery', 'cashondelivery'].includes(raw)) return 'Cash';
  return String(value || 'Unknown');
}

function renderAnalytics() {
  const wasteCanvas = document.getElementById('wasteTypeChart');
  const paymentCanvas = document.getElementById('paymentTypeChart');
  const statusCanvas = document.getElementById('pickupStatusChart');
  const ChartLib = window.Chart;

  if (!wasteCanvas || !paymentCanvas || !statusCanvas || !ChartLib) {
    return;
  }

  const wasteCounts = state.pickups.reduce((acc, pickup) => {
    const key = String(pickup?.wasteType || 'Other').trim() || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const paymentCounts = state.payments.reduce((acc, payment) => {
    const source = payment?.method || payment?.paymentMethod || 'Unknown';
    const key = normalizePaymentMethodLabel(source);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = state.pickups.reduce(
    (acc, pickup) => {
      const raw = String(pickup?.status || '').trim().toLowerCase();
      if (raw === 'completed') acc.Completed += 1;
      else if (raw === 'in-progress' || raw === 'in progress') acc['In-Progress'] += 1;
      else if (raw === 'assigned') acc.Assigned += 1;
      else acc.Pending += 1;
      return acc;
    },
    { Pending: 0, Assigned: 0, 'In-Progress': 0, Completed: 0 }
  );

  const wasteLabels = Object.keys(wasteCounts);
  const wasteValues = Object.values(wasteCounts);
  const paymentLabels = Object.keys(paymentCounts);
  const paymentValues = Object.values(paymentCounts);
  const statusLabels = Object.keys(statusCounts);
  const statusValues = Object.values(statusCounts);

  const wasteDatasetLabels = wasteLabels.length ? wasteLabels : ['No Data'];
  const wasteDatasetValues = wasteValues.length ? wasteValues : [1];
  const paymentDatasetLabels = paymentLabels.length ? paymentLabels : ['No Data'];
  const paymentDatasetValues = paymentValues.length ? paymentValues : [1];
  const statusDatasetLabels = statusLabels;
  const statusDatasetValues = statusValues;

  const paletteA = ['#2b8a3e', '#f59f00', '#1971c2', '#e03131', '#5f3dc4', '#0b7285'];
  const paletteB = ['#2f9e44', '#f08c00', '#1c7ed6', '#d6336c', '#6741d9', '#0c8599'];
  const paletteC = ['#f08c00', '#1971c2', '#0b7285', '#2b8a3e'];

  if (wasteTypeChartRef) {
    wasteTypeChartRef.destroy();
  }

  wasteTypeChartRef = new ChartLib(wasteCanvas, {
    type: 'doughnut',
    data: {
      labels: wasteDatasetLabels,
      datasets: [
        {
          data: wasteDatasetValues,
          backgroundColor: paletteA.slice(0, wasteDatasetLabels.length),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  if (paymentTypeChartRef) {
    paymentTypeChartRef.destroy();
  }

  paymentTypeChartRef = new ChartLib(paymentCanvas, {
    type: 'bar',
    data: {
      labels: paymentDatasetLabels,
      datasets: [
        {
          label: 'Payments',
          data: paymentDatasetValues,
          backgroundColor: paletteB.slice(0, paymentDatasetLabels.length),
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  if (pickupStatusChartRef) {
    pickupStatusChartRef.destroy();
  }

  pickupStatusChartRef = new ChartLib(statusCanvas, {
    type: 'line',
    data: {
      labels: statusDatasetLabels,
      datasets: [
        {
          label: 'Pickups',
          data: statusDatasetValues,
          borderColor: '#2b8a3e',
          backgroundColor: 'rgba(43,138,62,0.18)',
          pointBackgroundColor: paletteC,
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 6,
          borderWidth: 3,
          fill: true,
          tension: 0.25
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function showAdminProfileNotice(type, message) {
  const node = document.getElementById('adminProfileNotice');
  if (!node) {
    showNotice(type, message);
    return;
  }
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function bindAdminProfilePreview() {
  const imageInput = document.getElementById('adminProfileImage');
  const removeBtn = document.getElementById('adminRemoveProfileImageBtn');
  const preview = document.getElementById('adminProfilePreview');

  imageInput?.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (!file || !preview) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = String(reader.result || '');
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener('click', () => {
    if (imageInput) {
      imageInput.value = '';
    }
    if (preview) {
      preview.src = '';
      preview.classList.add('hidden');
    }
  });
}

function setupSections() {
  const buttons = document.querySelectorAll('#adminSubnav .subnav-btn');
  const sectionIds = [
    'adminOverviewSection',
    'adminUsersSection',
    'adminCollectorsSection',
    'adminTransactionsSection',
    'adminSupportSection',
    'adminAnalyticsSection',
    'adminProfileSection'
  ];

  const activate = (id) => {
    sectionIds.forEach((sectionId) => {
      document.getElementById(sectionId)?.classList.toggle('hidden', sectionId !== id);
    });
    buttons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-section') === id));

    if (id === 'adminAnalyticsSection') {
      setTimeout(() => renderAnalytics(), 0);
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(String(btn.getAttribute('data-section') || 'adminOverviewSection')));
  });

  const requestedSection = String(new URLSearchParams(window.location.search).get('section') || '').trim();
  const normalizedRequestedSection = requestedSection === 'adminQualitySection' ? 'adminSupportSection' : requestedSection;
  activate(sectionIds.includes(normalizedRequestedSection) ? normalizedRequestedSection : 'adminOverviewSection');
}

function nextCollectorEmployeeId() {
  const maxNum = state.collectors
    .map((c) => String(c.employeeId || '').toUpperCase())
    .map((id) => (/^COL-(\d+)$/.test(id) ? Number(id.split('-')[1]) : 0))
    .reduce((m, v) => Math.max(m, v), 0);
  return `COL-${String(maxNum + 1).padStart(4, '0')}`;
}

function syncCollectorEmployeeIdInput() {
  const input = document.getElementById('collectorEmployeeId');
  if (input && !String(input.value || '').trim()) {
    input.value = nextCollectorEmployeeId();
  }
}

async function loadData() {
  await loadSystemSettings();
  const [usersRes, pickupsRes, complaintsRes, paymentsRes, feedbackRes] = await Promise.all([
    userAPI.getAll(),
    pickupAPI.getAll({ limit: 300 }),
    complaintAPI.getAll({ limit: 300 }),
    paymentAPI.getAll({ limit: 300 }),
    feedbackAPI.getAll({ limit: 300 })
  ]);

  state.users = usersRes.users || [];
  state.collectors = state.users.filter((u) => u.role === 'collector');
  state.pickups = pickupsRes.pickups || [];
  state.complaints = complaintsRes.complaints || [];
  state.payments = paymentsRes.payments || [];
  state.feedback = feedbackRes.feedback || [];

  notifyAdminOnCollectorRejections(state.pickups);

  renderKpis();
  renderRequests();
  renderUsers();
  renderCollectors();
  renderTransactions();
  renderQuality();
  renderAnalytics();
  syncCollectorEmployeeIdInput();
}

function renderKpis() {
  const users = state.users.filter((u) => u.role === 'user');
  const completed = state.pickups.filter((p) => p.status === 'Completed').length;
  const approvedRevenue = state.payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const normalizedMethod = (method) => String(method || '').toLowerCase();

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value);
  };

  setText('kpiRequests', state.pickups.length);
  setText('kpiCompleted', completed);
  setText('kpiUsers', users.length);
  setText('kpiCollectors', state.collectors.length);
  setText('kpiRevenue', Math.round(approvedRevenue));

  const breakdown = document.getElementById('wasteBreakdown');
  if (breakdown) {
    const groups = state.pickups.reduce((acc, p) => {
      const k = p.wasteType || 'Other';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(groups);
    breakdown.innerHTML = entries.length
      ? entries.map(([k, v]) => `<span class="waste-chip">${k}: ${v}</span>`).join(' ')
      : 'No pickup records yet.';
  }

  const upi = state.payments.filter((p) => ['upi', 'upi payment'].includes(normalizedMethod(p.method))).reduce((s, p) => s + Number(p.amount || 0), 0);
  const bank = state.payments.filter((p) => ['net banking', 'bank payment'].includes(normalizedMethod(p.method))).reduce((s, p) => s + Number(p.amount || 0), 0);
  const card = state.payments.filter((p) => ['credit/debit card', 'card payment'].includes(normalizedMethod(p.method))).reduce((s, p) => s + Number(p.amount || 0), 0);
  const cash = state.payments.filter((p) => ['cash', 'cash on delivery', 'cashondelivery'].includes(normalizedMethod(p.method))).reduce((s, p) => s + Number(p.amount || 0), 0);
  const pending = state.payments.filter((p) => p.status !== 'Paid').reduce((s, p) => s + Number(p.amount || 0), 0);

  setText('upiTotal', Math.round(upi));
  setText('bankTotal', Math.round(bank));
  setText('cardTotal', Math.round(card));
  setText('cashTotal', Math.round(cash));
  setText('pendingRevenue', Math.round(pending));

  const fee = document.getElementById('pickupFee');
  if (fee) {
    const savedFee = localStorage.getItem('wds_admin_payment_fee');
    fee.value = String(currentPickupFee || Number(savedFee) || 50);
  }
}

async function loadSystemSettings() {
  try {
    const result = await settingsAPI.get();
    currentPickupFee = Number(result?.settings?.pickupFee || 50);
    localStorage.setItem('wds_admin_payment_fee', String(currentPickupFee));
  } catch (error) {
    const stored = Number(localStorage.getItem('wds_admin_payment_fee') || 50);
    currentPickupFee = stored || 50;
  }

  const feeInput = document.getElementById('pickupFee');
  if (feeInput) {
    feeInput.value = String(currentPickupFee);
  }
}

function renderRequests() {
  const tbody = document.getElementById('adminRequestRows');
  if (!tbody) return;
  if (!state.pickups.length) {
    tbody.innerHTML = '<tr><td colspan="11">No pickup requests yet.</td></tr>';
    return;
  }

  tbody.innerHTML = state.pickups
    .map((p) => {
      const options = state.collectors
        .map((c) => `<option value="${c.id}" ${p.collectorId === c.id ? 'selected' : ''}>${c.name}</option>`)
        .join('');

      return `
      <tr>
        <td>${p.id}</td>
        <td>${p.wasteType || '-'}</td>
        <td>${new Date(p.preferredDate || p.createdAt).toLocaleString()}</td>
        <td>${p.address || '-'}</td>
        <td>${p.paymentId ? 'Paid' : 'Pending'}</td>
        <td>${p.status || 'Pending'}</td>
        <td>${p.collectorId || '-'}</td>
        <td>
          <select data-collector-id="${p.id}">
            <option value="">Select</option>
            ${options}
          </select>
        </td>
        <td><button class="btn btn-outline" type="button" data-assign-id="${p.id}">Allocate</button></td>
        <td>
          <select data-status-id="${p.id}">
            <option value="Pending" ${(p.status || '') === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Assigned" ${(p.status || '') === 'Assigned' ? 'selected' : ''}>Assigned</option>
            <option value="In-Progress" ${(p.status || '') === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
            <option value="Completed" ${(p.status || '') === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td><button class="btn btn-primary" type="button" data-apply-status-id="${p.id}">Apply</button></td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-assign-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const requestId = String(btn.getAttribute('data-assign-id') || '');
      const selector = tbody.querySelector(`[data-collector-id="${requestId}"]`);
      const collectorId = selector ? String(selector.value || '') : '';
      if (!collectorId) {
        showNotice('error', 'Select a collector first.');
        return;
      }
      try {
        await pickupAPI.assignCollector(requestId, collectorId);
        showNotice('success', `Collector assigned for ${requestId}.`);
        await loadData();
      } catch (error) {
        showNotice('error', error.message || 'Failed to assign collector.');
      }
    });
  });

  tbody.querySelectorAll('[data-apply-status-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const requestId = String(btn.getAttribute('data-apply-status-id') || '');
      const selector = tbody.querySelector(`[data-status-id="${requestId}"]`);
      const status = selector ? String(selector.value || '') : '';
      if (!status) return;
      try {
        await pickupAPI.updateStatus(requestId, status);
        showNotice('success', `Status updated for ${requestId}.`);
        await loadData();
      } catch (error) {
        showNotice('error', error.message || 'Failed to update status.');
      }
    });
  });
}

function renderUsers() {
  const tbody = document.getElementById('adminUsersRows');
  if (!tbody) return;
  const users = state.users.filter((u) => u.role === 'user');
  tbody.innerHTML = users.length
    ? users
        .map(
          (u) => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.phone || '-'}</td><td><button class="btn btn-danger" type="button" data-remove-user-id="${u.id}">Remove</button></td></tr>`
        )
        .join('')
    : '<tr><td colspan="4">No users found.</td></tr>';

  tbody.querySelectorAll('[data-remove-user-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = String(btn.getAttribute('data-remove-user-id') || '');
      try {
        await userAPI.delete(id);
        showNotice('success', 'User removed successfully.');
        await loadData();
      } catch (error) {
        showNotice('error', error.message || 'Failed to remove user.');
      }
    });
  });
}

function renderCollectors() {
  const tbody = document.getElementById('adminCollectorsRows');
  if (!tbody) return;
  tbody.innerHTML = state.collectors.length
    ? state.collectors
        .map(
          (u) => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.employeeId || '-'}</td><td>${u.phone || '-'}</td><td><button class="btn btn-danger" type="button" data-remove-collector-id="${u.id}">Remove</button></td></tr>`
        )
        .join('')
    : '<tr><td colspan="5">No collectors found.</td></tr>';

  tbody.querySelectorAll('[data-remove-collector-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = String(btn.getAttribute('data-remove-collector-id') || '');
      try {
        await userAPI.delete(id);
        showNotice('success', 'Collector removed successfully.');
        await loadData();
      } catch (error) {
        showNotice('error', error.message || 'Failed to remove collector.');
      }
    });
  });
}

function renderTransactions() {
  const tbody = document.getElementById('adminTransactionRows');
  if (!tbody) return;
  tbody.innerHTML = state.payments.length
    ? state.payments
        .map(
          (p) => `<tr><td>${p.pickupRequestId || p.requestId || '-'}</td><td>${p.method || p.paymentMethod || '-'}</td><td>${p.amount || 0}</td><td>${p.status || p.paymentStatus || '-'}</td><td>${p.transactionId || '-'}</td><td>${new Date(p.createdAt).toLocaleString()}</td></tr>`
        )
        .join('')
    : '<tr><td colspan="6">No transactions yet.</td></tr>';
}

function renderQuality() {
  const complaintRows = document.getElementById('complaintRows');
  const feedbackRows = document.getElementById('feedbackRows');

  if (complaintRows) {
    complaintRows.innerHTML = state.complaints.length
      ? state.complaints
          .map(
            (c) => `<tr><td>${c.subject}</td><td>${c.message}</td><td>${c.status}</td><td>${new Date(c.createdAt).toLocaleString()}</td></tr>`
          )
          .join('')
      : '<tr><td colspan="4">No complaints found.</td></tr>';
  }

  if (feedbackRows) {
    feedbackRows.innerHTML = state.feedback.length
      ? state.feedback
          .map((item) => {
            const status = String(item.moderationStatus || 'Pending');
            const actions =
              status === 'Pending'
                ? `<div class="actions-row"><button class="btn btn-primary" type="button" data-feedback-approve="${item.id}">Approve</button><button class="btn btn-danger" type="button" data-feedback-reject="${item.id}">Reject</button></div>`
                : '-';

            return `<tr><td>${item.pickupRequestId || '-'}</td><td>${'★'.repeat(Math.max(1, Math.min(5, Number(item.rating || 0))))} (${item.rating || 0}/5)</td><td>${item.comment || '-'}</td><td>${item.userName || item.userId || '-'}</td><td>${status}</td><td>${new Date(item.createdAt).toLocaleString()}</td><td>${actions}</td></tr>`;
          })
          .join('')
      : '<tr><td colspan="7">No feedback records yet.</td></tr>';

    feedbackRows.querySelectorAll('[data-feedback-approve]').forEach((button) => {
      button.addEventListener('click', async () => {
        const feedbackId = String(button.getAttribute('data-feedback-approve') || '');
        if (!feedbackId) return;
        try {
          await feedbackAPI.moderate(feedbackId, 'approve');
          showNotice('success', 'Feedback approved successfully.');
          await loadData();
        } catch (error) {
          showNotice('error', error.message || 'Failed to approve feedback.');
        }
      });
    });

    feedbackRows.querySelectorAll('[data-feedback-reject]').forEach((button) => {
      button.addEventListener('click', async () => {
        const feedbackId = String(button.getAttribute('data-feedback-reject') || '');
        if (!feedbackId) return;
        const adminNote = window.prompt('Optional rejection note:', '') || '';
        try {
          await feedbackAPI.moderate(feedbackId, 'reject', adminNote);
          showNotice('success', 'Feedback rejected successfully.');
          await loadData();
        } catch (error) {
          showNotice('error', error.message || 'Failed to reject feedback.');
        }
      });
    });
  }
}

function bindForms() {
  syncCollectorEmployeeIdInput();

  document.getElementById('generateCollectorEmployeeId')?.addEventListener('click', () => {
    const input = document.getElementById('collectorEmployeeId');
    if (input) input.value = nextCollectorEmployeeId();
  });

  document.getElementById('addUserForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await userAPI.create({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
        password: String(formData.get('password') || ''),
        role: 'user'
      });
      event.currentTarget.reset();
      showNotice('success', 'User account created successfully.');
      await loadData();
    } catch (error) {
      showNotice('error', error.message || 'Failed to add user.');
    }
  });

  document.getElementById('addCollectorForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const resolvedEmployeeId = String(formData.get('employeeId') || '').trim().toUpperCase() || nextCollectorEmployeeId();
    const collectorEmail = String(formData.get('email') || '').trim();
    try {
      await userAPI.create({
        name: String(formData.get('name') || ''),
        email: collectorEmail,
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
        password: String(formData.get('password') || ''),
        employeeId: resolvedEmployeeId,
        role: 'collector'
      });
      event.currentTarget.reset();
      showNotice('success', `Collector account created successfully. Login with ${collectorEmail} or employee code ${resolvedEmployeeId}.`);
      await loadData();
      syncCollectorEmployeeIdInput();
    } catch (error) {
      showNotice('error', error.message || 'Failed to add collector.');
    }
  });

  document.getElementById('feeForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const feeInput = document.getElementById('pickupFee');
    const feeAmount = Number(feeInput?.value || 50);

    try {
      const result = await settingsAPI.update({ pickupFee: feeAmount });
      currentPickupFee = Number(result?.settings?.pickupFee || feeAmount);
      localStorage.setItem('wds_admin_payment_fee', String(currentPickupFee));
      showNotice('success', `Pickup fee set to ₹${currentPickupFee}. Users will see this amount in their payment panel.`);
    } catch (error) {
      const fallback = Number(localStorage.getItem('wds_admin_payment_fee') || 50);
      currentPickupFee = feeAmount || fallback;
      localStorage.setItem('wds_admin_payment_fee', String(currentPickupFee));
      showNotice('error', `Failed to save settings to server: ${error.message || 'Please retry.'}`);
    }
  });

  document.getElementById('adminProfileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const session = getActiveSessionUser();
    const formData = new FormData(event.currentTarget);

    let profileImage = '';
    const selectedImage = formData.get('adminProfileImage');
    if (selectedImage instanceof File && selectedImage.size > 0) {
      profileImage = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read profile image.'));
        reader.readAsDataURL(selectedImage);
      });
    } else {
      const currentPreview = document.getElementById('adminProfilePreview');
      if (currentPreview?.src && !currentPreview.classList.contains('hidden')) {
        profileImage = currentPreview.src;
      }
    }

    try {
      const updated = await userAPI.updateProfile(session.id, {
        name: String(formData.get('adminNameInput') || ''),
        phone: String(formData.get('adminPhoneInput') || ''),
        email: String(formData.get('adminEmailInput') || ''),
        address: '',
        profileImage
      });
      localStorage.setItem('wds_session_v1', JSON.stringify(updated.user));
      showAdminProfileNotice('success', 'Profile updated successfully.');
      await loadAdminProfile();
    } catch (error) {
      showAdminProfileNotice('error', error.message || 'Failed to update profile.');
    }
  });

  document.getElementById('adminPasswordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const session = getActiveSessionUser();
    const formData = new FormData(event.currentTarget);
    const current = String(formData.get('adminCurrentPassword') || '');
    const next = String(formData.get('adminNewPassword') || '');
    const confirm = String(formData.get('adminConfirmPassword') || '');

    if (next.length < 8) {
      showNotice('error', 'New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      showNotice('error', 'Passwords do not match.');
      return;
    }

    try {
      await userAPI.changePassword(session.id, current, next);
      event.currentTarget.reset();
      showNotice('success', 'Password changed successfully.');
    } catch (error) {
      showNotice('error', error.message || 'Failed to change password.');
    }
  });
}

async function loadAdminProfile() {
  const session = getActiveSessionUser();
  const { user } = await userAPI.getById(session.id);
  const welcome = document.getElementById('adminWelcome');
  if (welcome) welcome.textContent = `Admin Dashboard - ${user.name}`;
  const name = document.getElementById('adminNameInput');
  const phone = document.getElementById('adminPhoneInput');
  const email = document.getElementById('adminEmailInput');
  const preview = document.getElementById('adminProfilePreview');
  if (name) name.value = user.name || '';
  if (phone) phone.value = user.phone || '';
  if (email) email.value = user.email || '';
  if (preview) {
    if (user.profileImage) {
      preview.src = user.profileImage;
      preview.classList.remove('hidden');
    } else {
      preview.src = '';
      preview.classList.add('hidden');
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const session = getActiveSessionUser();
  const token = getAuthToken();
  if (!session || !token || session.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupSections();
  bindAdminProfilePreview();
  bindForms();

  try {
    await Promise.all([loadData(), loadAdminProfile()]);
  } catch (error) {
    if (String(error?.message || '').toLowerCase().includes('no token provided') || error?.status === 401) {
      logout();
      window.location.href = 'auth.html';
      return;
    }
    showNotice('error', error.message || 'Failed to load dashboard data.');
  }

  let refreshInProgress = false;

  setInterval(async () => {
    if (refreshInProgress) {
      return;
    }

    refreshInProgress = true;
    try {
      await loadData();
    } catch {
      // keep silent during background refresh
    } finally {
      refreshInProgress = false;
    }
  }, 30000);

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();
    window.location.href = 'auth.html';
  });
});
