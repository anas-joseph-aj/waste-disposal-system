import { getActiveSessionUser, getSessionUser, logout } from './services/auth.js';
import { pickupAPI, complaintAPI, paymentAPI, userAPI, settingsAPI, feedbackAPI } from './services/api.js';

let requests = [];
let complaints = [];
let payments = [];
let feedback = [];
let notifications = [];
let notificationReadStatus = {};
let pickupStatusCache = {};
let pendingPickupId = '';
let liveSyncTimerId = null;
let isPreparingPickupPayment = false;
let activateUserSection = () => {};
let currentPaymentAmount = 0;
let paymentSuccessModalLocked = false;
let paymentSuccessUnlockAt = 0;
let paymentSuccessCountdownTimerId = null;

let SERVICE_FEE = 50;
const WASTE_RATES = {
  'Organic': 15,
  'Plastic': 20,
  'E-waste': 35,
  'Hazardous': 45,
  'Paper': 12,
  'Glass': 10,
  'Other': 18
};

const PENDING_PAYMENT_PICKUP_KEY = 'wds_pending_payment_pickup_id';
const OPEN_PAYMENT_PANEL_KEY = 'wds_open_payment_panel';
const ADMIN_PAYMENT_FEE_KEY = 'wds_admin_payment_fee';
const NOTIFICATION_READ_STATUS_KEY = 'wds_notification_read_status';
const PICKUP_STATUS_CACHE_KEY = 'wds_pickup_status_cache';
const PAYMENT_SUCCESS_MIN_STAY_MS = 4 * 60 * 1000;

const PAYMENT_METHOD_META = {
  UPI: {
    hint: 'Google Pay, PhonePe, Paytm, BHIM',
    summary: 'Select UPI and use your UPI app to pay. Transaction ID is auto-generated.'
  },
  'Credit/Debit Card': {
    hint: 'Visa, Mastercard, RuPay',
    summary: 'Enter card details securely to process payment.'
  },
  'Net Banking': {
    hint: 'All major Indian banks',
    summary: 'Log in to your bank portal and complete payment.'
  },
};

const LIVE_PICKUP_REFRESH_MS = 15000;

function buildStatusMap(items) {
  const map = new Map();
  (items || []).forEach((item) => {
    if (item?.id) {
      map.set(String(item.id), String(item.status || 'Pending'));
    }
  });
  return map;
}

function statusClass(status) {
  return `status-pill status-${String(status || 'pending').toLowerCase().replace(/\s+/g, '-')}`;
}

function showNotice(type, message) {
  const node = document.getElementById('userNotice');
  if (!node) return;
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function showProfileNotice(type, message) {
  const node = document.getElementById('profileNotice');
  if (!node) return;
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function showPasswordNotice(type, message) {
  const node = document.getElementById('passwordNotice');
  if (!node) return;
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function showPaymentNotice(type, message) {
  const node = document.getElementById('paymentNotice');
  if (!node) return;
  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function addNotification(title, message, type = 'info', key = '') {
  const normalizedKey = String(key || '').trim();
  if (normalizedKey && notifications.some((item) => item.key === normalizedKey)) {
    return;
  }

  const notification = {
    id: String(Date.now()),
    key: normalizedKey,
    title,
    message,
    type,
    createdAt: new Date().toLocaleString(),
    isRead: false
  };
  notifications.unshift(notification);
  renderNotifications();
  updateNotificationBadge();
}

function savePickupStatusCache(items) {
  const nextCache = {};
  (items || []).forEach((pickup) => {
    if (!pickup?.id) {
      return;
    }
    nextCache[String(pickup.id)] = String(pickup.status || 'Pending');
  });

  pickupStatusCache = nextCache;
  localStorage.setItem(PICKUP_STATUS_CACHE_KEY, JSON.stringify(pickupStatusCache));
}

function getFeedbackByPickupId(pickupId) {
  return feedback.find((item) => String(item.pickupRequestId || '') === String(pickupId || '')) || null;
}

function renderReviewFormOptions() {
  const select = document.getElementById('reviewPickupId');
  if (!select) {
    return;
  }

  const completed = requests.filter((item) => String(item.status || '') === 'Completed');
  if (!completed.length) {
    select.innerHTML = '<option value="">No completed requests available</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = completed
    .map((item) => {
      const existing = getFeedbackByPickupId(item.id);
      const status = String(existing?.moderationStatus || '').trim();
      const statusLabel = status ? ` (${status})` : '';
      return `<option value="${item.id}">${item.id} - ${item.wasteType || 'Waste'}${statusLabel}</option>`;
    })
    .join('');
}

function getModerationPillClass(status) {
  const normalized = String(status || 'Pending').toLowerCase();
  if (normalized === 'approved') return 'status-completed';
  if (normalized === 'rejected') return 'status-cancelled';
  return 'status-pending';
}

async function submitReviewFromForm() {
  const pickupId = String(document.getElementById('reviewPickupId')?.value || '').trim();
  const rating = Number(document.getElementById('reviewRating')?.value || 0);
  const comment = String(document.getElementById('reviewComment')?.value || '').trim();

  if (!pickupId) {
    showNotice('error', 'Choose a completed request for review.');
    return;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    showNotice('error', 'Rating must be between 1 and 5.');
    return;
  }

  try {
    await feedbackAPI.create({
      pickupRequestId: pickupId,
      rating,
      comment
    });
    showNotice('success', `Review submitted for ${pickupId}. Waiting for admin approval.`);
    document.getElementById('reviewComment').value = '';
    await loadAllData();
  } catch (error) {
    showNotice('error', error.message || 'Failed to submit review.');
  }
}

function updateNotificationBadge() {
  const badgeButton = document.querySelector('#userSubnav .subnav-btn[data-section="notificationsSection"]');
  if (!badgeButton) return;

  const unreadCount = notifications.reduce((count, notif) => {
    const isRead = notificationReadStatus[notif.id] || notif.isRead;
    return count + (isRead ? 0 : 1);
  }, 0);

  badgeButton.textContent = unreadCount > 0 ? `Notifications (${unreadCount})` : 'Notifications';
}

function markNotificationAsRead(notificationId) {
  notificationReadStatus[notificationId] = true;
  localStorage.setItem(NOTIFICATION_READ_STATUS_KEY, JSON.stringify(notificationReadStatus));
  renderNotifications();
  updateNotificationBadge();
}

function renderNotifications() {
  const container = document.getElementById('notifications');
  if (!container) return;

  if (!notifications.length) {
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No notifications yet.</div>';
    updateNotificationBadge();
    return;
  }

  container.innerHTML = notifications
    .map((notif) => {
      const isRead = notificationReadStatus[notif.id] || notif.isRead;
      return `
        <div class="notification-card ${isRead ? 'notification-read' : 'notification-unread'}" style="margin-bottom: 12px; padding: 16px; border-radius: 8px; border-left: 4px solid ${isRead ? '#4CAF50' : '#ff9800'}; background: ${isRead ? '#f1f8f4' : '#fff3f0'};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <h4 style="margin: 0 0 4px 0; color: ${isRead ? '#2e7d32' : '#e65100'};">${notif.title}</h4>
              <p style="margin: 0; color: #666; font-size: 0.9rem;">${notif.message}</p>
            </div>
            ${!isRead ? `<button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.85rem;" data-notification-read-id="${notif.id}">Mark as Read</button>` : '<span style="color: #4CAF50; font-weight: bold;">✓ Read</span>'}
          </div>
          <small style="color: #999;">${notif.createdAt}</small>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('[data-notification-read-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const notificationId = String(button.getAttribute('data-notification-read-id') || '').trim();
      if (!notificationId) {
        return;
      }
      markNotificationAsRead(notificationId);
    });
  });

  updateNotificationBadge();
}

function hidePaymentNotice() {
  const node = document.getElementById('paymentNotice');
  if (!node) return;
  node.classList.add('hidden');
  node.textContent = '';
}

function getWasteRate(type) {
  return WASTE_RATES[type] || WASTE_RATES.Other;
}

function formatCurrency(value) {
  return Number(value || 0).toFixed(2);
}

async function loadSystemSettings() {
  try {
    const result = await settingsAPI.get();
    SERVICE_FEE = Number(result?.settings?.pickupFee || 50);
    localStorage.setItem(ADMIN_PAYMENT_FEE_KEY, String(SERVICE_FEE));
  } catch (error) {
    const stored = Number(localStorage.getItem(ADMIN_PAYMENT_FEE_KEY) || 50);
    SERVICE_FEE = stored || 50;
  }

  updatePaymentAmount();
}

function updatePaymentAmount() {
  const serviceCost = SERVICE_FEE;
  const total = serviceCost;

  currentPaymentAmount = total;

  const amountField = document.getElementById('paymentAmount');
  if (amountField) {
    amountField.value = formatCurrency(total);
  }

  const summaryNode = document.getElementById('paymentSummary');
  if (summaryNode) {
    summaryNode.innerHTML = `
      <div><strong>Payment Summary</strong></div>
      <div>Admin-fixed pickup fee: ₹${formatCurrency(serviceCost)}</div>
      <div><strong>Total: ₹${formatCurrency(total)}</strong></div>
    `;
  }

  updatePayButtonLabel();
}

function updatePayButtonLabel() {
  const method = String(document.getElementById('paymentMethod')?.value || 'UPI');
  const button = document.querySelector('#paymentForm button[type="submit"]');
  if (!button) return;

  const displayMethod = method === 'CashOnDelivery' ? 'Cash on Delivery' : method;
  button.textContent = `Pay ₹${formatCurrency(currentPaymentAmount)} via ${displayMethod}`;
}


function calculateTotalForForm() {
  updatePaymentAmount();
}


function showPaymentSuccessModal(requestIdValue = '') {
  const overlay = document.getElementById('paymentSuccessOverlay');
  const requestNode = document.getElementById('paymentSuccessRequestId');
  const messageNode = document.getElementById('paymentSuccessMessage');
  const continueBtn = document.getElementById('paymentSuccessContinueBtn');
  const trackBtn = document.getElementById('paymentSuccessTrackBtn');
  if (!overlay) return;

  const requestId = String(requestIdValue || '').trim() || 'N/A';
  if (requestNode) {
    requestNode.textContent = requestId;
  }
  if (messageNode) {
    messageNode.textContent = `Request ${requestId} is submitted and confirmed.`;
  }

  if (continueBtn) {
    const freshContinueBtn = continueBtn.cloneNode(true);
    continueBtn.replaceWith(freshContinueBtn);
    freshContinueBtn.addEventListener('click', () => closePaymentSuccessModal('pickupSection', true));
  }

  if (trackBtn) {
    const freshTrackBtn = trackBtn.cloneNode(true);
    trackBtn.replaceWith(freshTrackBtn);
    freshTrackBtn.addEventListener('click', () => closePaymentSuccessModal('trackingSection', true));
  }

  const formatRemaining = (remainingMs) => {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const updateSuccessActions = () => {
    const now = Date.now();
    const remainingMs = Math.max(0, paymentSuccessUnlockAt - now);
    const canClose = remainingMs <= 0;

    const continueActionBtn = document.getElementById('paymentSuccessContinueBtn');
    const trackActionBtn = document.getElementById('paymentSuccessTrackBtn');

    if (continueActionBtn) {
      continueActionBtn.disabled = false;
      continueActionBtn.textContent = canClose ? 'Continue to Pickup' : `Continue in ${formatRemaining(remainingMs)}`;
    }

    if (trackActionBtn) {
      trackActionBtn.disabled = false;
      trackActionBtn.textContent = canClose ? 'View Tracking' : `Track in ${formatRemaining(remainingMs)}`;
    }
  };

  if (paymentSuccessCountdownTimerId) {
    clearInterval(paymentSuccessCountdownTimerId);
    paymentSuccessCountdownTimerId = null;
  }

  paymentSuccessUnlockAt = Date.now() + PAYMENT_SUCCESS_MIN_STAY_MS;
  updateSuccessActions();
  paymentSuccessCountdownTimerId = setInterval(() => {
    updateSuccessActions();
    if (Date.now() >= paymentSuccessUnlockAt) {
      clearInterval(paymentSuccessCountdownTimerId);
      paymentSuccessCountdownTimerId = null;
    }
  }, 1000);

  paymentSuccessModalLocked = true;
  overlay.classList.remove('hidden');
  document.body.classList.add('overlay-lock');
}

function closePaymentSuccessModal(nextSection = 'trackingSection', allowClose = false) {
  const lockActive = paymentSuccessModalLocked && Date.now() < paymentSuccessUnlockAt;
  if (!allowClose && (lockActive || paymentSuccessModalLocked)) {
    return;
  }
  const overlay = document.getElementById('paymentSuccessOverlay');
  if (!overlay) return;
  if (paymentSuccessCountdownTimerId) {
    clearInterval(paymentSuccessCountdownTimerId);
    paymentSuccessCountdownTimerId = null;
  }
  paymentSuccessUnlockAt = 0;
  paymentSuccessModalLocked = false;
  overlay.classList.add('hidden');
  document.body.classList.remove('overlay-lock');
  activateUserSection(nextSection);
}

function applyPaymentMethodUI(method) {
  const config = PAYMENT_METHOD_META[method] || null;
  const hintNode = document.getElementById('paymentMethodHint');
  const detailsBlock = document.getElementById('paymentDetailsBlock');

  document.querySelectorAll('.payment-mini-form').forEach((formNode) => {
    const formMethod = String(formNode.getAttribute('data-form-method') || '');
    formNode.classList.toggle('hidden', !method || formMethod !== method);
  });

  if (detailsBlock) {
    detailsBlock.classList.toggle('hidden', !method);
  }

  if (hintNode) {
    hintNode.textContent = config?.hint || 'Choose which type of payment you want to make.';
  }

  updatePaymentAmount();
}

function resetPaymentPanelState() {
  const form = document.getElementById('paymentForm');
  form?.reset();
  document.querySelectorAll('.payment-method-btn').forEach((btn) => btn.classList.remove('active'));
  const methodInput = document.getElementById('paymentMethod');
  if (methodInput) methodInput.value = 'UPI';
  const upiButton = document.querySelector('.payment-method-btn[data-method="UPI"]');
  upiButton?.classList.add('active');
  applyPaymentMethodUI('UPI');
}

function resetPickupFormAfterPayment() {
  const pickupForm = document.getElementById('pickupForm');
  if (!pickupForm) {
    return;
  }

  pickupForm.reset();
  pickupForm.style.display = '';
  setupPickupDateConstraints();

  const imageHint = document.getElementById('wasteImageHint');
  if (imageHint) {
    imageHint.textContent = 'No file selected. You can submit without an image.';
  }

  updatePaymentAmount();
}

function getPaymentMethodDetails(method) {
  if (method === 'UPI') {
    const upiId = String(document.getElementById('upiId')?.value || '').trim();
    const upiTxnId = String(document.getElementById('upiTxnId')?.value || '').trim();
    if (!upiId) return { ok: false, error: 'Enter UPI ID.' };
    if (!upiTxnId) return { ok: false, error: 'Enter UPI transaction ID.' };
    return {
      ok: true,
      reference: `UPI ID ${upiId} TXN ${upiTxnId}`,
      transactionId: upiTxnId
    };
  }

  if (method === 'Credit/Debit Card') {
    const cardNumber = String(document.getElementById('cardNumberMasked')?.value || '').replace(/\s/g, '');
    const cardExpiry = String(document.getElementById('cardExpiry')?.value || '').trim();
    const cardCvv = String(document.getElementById('cardCvv')?.value || '').trim();
    if (cardNumber.length < 12 || cardNumber.length > 19) return { ok: false, error: 'Enter a valid card number.' };
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return { ok: false, error: 'Enter expiry as MM/YY.' };
    if (!/^\d{3,4}$/.test(cardCvv)) return { ok: false, error: 'Enter CVV.' };
    const txn = `CARD-${Date.now()}`;
    return {
      ok: true,
      reference: `Card ending ${cardNumber.slice(-4)} Exp ${cardExpiry}`,
      transactionId: txn
    };
  }

  if (method === 'Net Banking') {
    const bankName = String(document.getElementById('bankName')?.value || '').trim();
    const bankTxnId = String(document.getElementById('bankTxnId')?.value || '').trim();
    if (!bankName) return { ok: false, error: 'Enter bank name.' };
    if (!bankTxnId) return { ok: false, error: 'Enter bank transaction ID.' };
    return {
      ok: true,
      reference: `Bank ${bankName} TXN ${bankTxnId}`,
      transactionId: bankTxnId
    };
  }

  return { ok: true, reference: '', transactionId: `TXN-${Date.now()}` };
}

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function bindPaymentInputMasks() {
  const bankLast4 = document.getElementById('bankAccountLast4');
  const cardNumber = document.getElementById('cardNumberMasked');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvv = document.getElementById('cardCvv');

  bankLast4?.addEventListener('input', () => {
    bankLast4.value = digitsOnly(bankLast4.value).slice(0, 4);
  });

  cardNumber?.addEventListener('input', () => {
    const digits = digitsOnly(cardNumber.value).slice(0, 16);
    cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });

  cardExpiry?.addEventListener('input', () => {
    const digits = digitsOnly(cardExpiry.value).slice(0, 4);
    if (digits.length <= 2) {
      cardExpiry.value = digits;
      return;
    }
    cardExpiry.value = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  });

  cardCvv?.addEventListener('input', () => {
    cardCvv.value = digitsOnly(cardCvv.value).slice(0, 3);
  });
}

function validatePaymentFields(method, formData) {
  if (method === 'Bank Payment') {
    const bankTxnRef = String(formData.get('bankTxnRef') || '').trim();
    const bankName = String(formData.get('bankName') || '').trim();
    const bankAccountLast4 = digitsOnly(formData.get('bankAccountLast4')).slice(0, 4);

    if (!/^[A-Za-z0-9-]{6,30}$/.test(bankTxnRef)) {
      return { ok: false, message: 'Enter a valid bank transaction reference (6-30 letters/numbers).' };
    }
    if (bankName.length < 2) {
      return { ok: false, message: 'Enter a valid bank name.' };
    }
    if (!/^\d{4}$/.test(bankAccountLast4)) {
      return { ok: false, message: 'Account last 4 digits must be exactly 4 numbers.' };
    }

    return {
      ok: true,
      transactionId: bankTxnRef,
      reference: `${bankName} / A-C ${bankAccountLast4}`
    };
  }

  if (method === 'UPI Payment') {
    const upiTxnRef = String(formData.get('upiTxnRef') || '').trim();
    const upiId = String(formData.get('upiId') || '').trim();

    if (!/^[A-Za-z0-9-]{6,30}$/.test(upiTxnRef)) {
      return { ok: false, message: 'Enter a valid UPI reference ID (6-30 letters/numbers).' };
    }
    if (!/^[A-Za-z0-9._-]{2,}@[A-Za-z]{2,}$/.test(upiId)) {
      return { ok: false, message: 'Enter a valid UPI ID (example: name@bank).' };
    }

    return {
      ok: true,
      transactionId: upiTxnRef,
      reference: upiId
    };
  }

  if (method === 'Card Payment') {
    const cardGatewayTxn = String(formData.get('cardGatewayTxn') || '').trim();
    const cardHolderName = String(formData.get('cardHolderName') || '').trim();
    const cardDigits = digitsOnly(formData.get('cardNumberMasked'));
    const cardExpiry = String(formData.get('cardExpiry') || '').trim();
    const cardCvv = digitsOnly(formData.get('cardCvv')).slice(0, 3);

    if (!/^[A-Za-z0-9-]{6,30}$/.test(cardGatewayTxn)) {
      return { ok: false, message: 'Enter a valid card transaction ID (6-30 letters/numbers).' };
    }
    if (!/^[A-Za-z ]{3,}$/.test(cardHolderName)) {
      return { ok: false, message: 'Enter a valid card holder name.' };
    }
    if (!/^\d{16}$/.test(cardDigits)) {
      return { ok: false, message: 'Card number must be 16 digits.' };
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      return { ok: false, message: 'Expiry must be in MM/YY format.' };
    }
    if (!/^\d{3}$/.test(cardCvv)) {
      return { ok: false, message: 'CVV must be exactly 3 digits.' };
    }

    const [month, year] = cardExpiry.split('/').map(Number);
    const expiryDate = new Date(2000 + year, month, 0, 23, 59, 59);
    if (expiryDate < new Date()) {
      return { ok: false, message: 'Card expiry date cannot be in the past.' };
    }

    return {
      ok: true,
      transactionId: cardGatewayTxn,
      reference: `****${cardDigits.slice(-4)} / EXP ${cardExpiry}`
    };
  }

  return { ok: false, message: 'Unsupported payment method selected.' };
}

function setupSections() {
  const buttons = document.querySelectorAll('#userSubnav .subnav-btn');
  const sectionIds = [
    'profileSection',
    'trackingSection',
    'pickupSection',
    'paymentSection',
    'complaintsSection',
    'historySection',
    'notificationsSection'
  ];

  const activate = (id) => {
    sectionIds.forEach((sectionId) => {
      document.getElementById(sectionId)?.classList.toggle('hidden', sectionId !== id);
    });
    buttons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-section') === id));
  };

  activateUserSection = activate;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(String(btn.getAttribute('data-section') || 'profileSection')));
  });

  const requestedSection = String(new URLSearchParams(window.location.search).get('section') || '').trim();
  activate(sectionIds.includes(requestedSection) ? requestedSection : 'profileSection');
}

function formatLocalDateTimeForInput(date) {
  const pad = (value) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateTimeLocal(value) {
  const [datePart, timePart] = String(value || '').split('T');
  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart.split('-').map((part) => Number(part));
  const [hour, minute] = timePart.split(':').map((part) => Number(part));
  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    return null;
  }

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function setupPickupDateConstraints() {
  const dateInput = document.getElementById('dateTime');
  if (!dateInput) {
    return;
  }

  const applyMinDate = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const minValue = formatLocalDateTimeForInput(now);
    dateInput.min = minValue;

    if (dateInput.value && dateInput.value < minValue) {
      dateInput.value = minValue;
    }
  };

  applyMinDate();
  dateInput.addEventListener('focus', applyMinDate);
  dateInput.addEventListener('click', applyMinDate);
}

function bindProfilePreview() {
  const imageInput = document.getElementById('profileImage');
  const removeBtn = document.getElementById('removeProfileImageBtn');
  const imagePreview = document.getElementById('profilePreview');
  const detailsBox = document.getElementById('profileDetailsPreview');

  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  const phoneInput = document.getElementById('profilePhoneInput');
  const addressInput = document.getElementById('profileAddressInput');

  const previewName = document.getElementById('previewName');
  const previewEmail = document.getElementById('previewEmail');
  const previewPhone = document.getElementById('previewPhone');
  const previewAddress = document.getElementById('previewAddress');

  const renderDetails = () => {
    if (previewName) previewName.textContent = String(nameInput?.value || '-');
    if (previewEmail) previewEmail.textContent = String(emailInput?.value || '-');
    if (previewPhone) previewPhone.textContent = String(phoneInput?.value || '-');
    if (previewAddress) previewAddress.textContent = String(addressInput?.value || '-');
    detailsBox?.classList.remove('hidden');
  };

  [nameInput, emailInput, phoneInput, addressInput].forEach((input) => {
    input?.addEventListener('input', renderDetails);
  });

  imageInput?.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (!file || !imagePreview) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = String(reader.result || '');
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener('click', () => {
    if (imageInput) {
      imageInput.value = '';
    }
    if (imagePreview) {
      imagePreview.src = '';
      imagePreview.classList.add('hidden');
    }
  });

  renderDetails();
}

function setupWasteTypes() {
  const select = document.getElementById('wasteType');
  if (!select) return;
  const options = ['Organic', 'Plastic', 'E-waste', 'Hazardous', 'Paper', 'Glass', 'Other'];
  select.innerHTML = options.map((x) => `<option value="${x}">${x}</option>`).join('');
}

async function loadAllData() {
  const resultEntries = await Promise.allSettled([
    pickupAPI.getAll({ limit: 300 }),
    complaintAPI.getAll({ limit: 300 }),
    paymentAPI.getAll({ limit: 300 }),
    feedbackAPI.getAll({ limit: 300 })
  ]);

  const labels = ['pickup requests', 'complaints', 'payments', 'feedback'];
  const [pickupResult, complaintResult, paymentResult, feedbackResult] = resultEntries;

  const errors = resultEntries
    .map((result, index) => ({ result, label: labels[index] }))
    .filter((entry) => entry.result.status === 'rejected')
    .map((entry) => {
      const reason = entry.result.reason;
      const message = String(reason?.message || '').trim();
      return `${entry.label}: ${message || 'Request failed'}`;
    });

  const pickupRes = pickupResult.status === 'fulfilled' ? pickupResult.value : { pickups: [] };
  const complaintRes = complaintResult.status === 'fulfilled' ? complaintResult.value : { complaints: [] };
  const paymentRes = paymentResult.status === 'fulfilled' ? paymentResult.value : { payments: [] };
  const feedbackRes = feedbackResult.status === 'fulfilled' ? feedbackResult.value : { feedback: [] };

  complaints = complaintRes.complaints || [];
  payments = paymentRes.payments || [];
  feedback = feedbackRes.feedback || [];

  applyPickupUpdates(pickupRes.pickups || [], { notifyChanges: true });
  renderComplaintHistory();
  renderPaymentHistory();

  if (errors.length) {
    throw new Error(errors[0]);
  }
}

function applyPickupUpdates(nextPickups, { notifyChanges = false } = {}) {
  const before = buildStatusMap(requests);
  const after = buildStatusMap(nextPickups);

  requests = nextPickups || [];
  renderTracking();
  renderHistory();
  renderReviewFormOptions();

  if (!notifyChanges) {
    nextPickups?.forEach((pickup) => {
      if (pickup.collectorId && !notifications.some((notification) => notification.message?.includes(`Request ${pickup.id}`) && notification.message?.includes('collector'))) {
        addNotification('Collector Assigned', `A collector has been assigned to your request ${pickup.id}.`, 'info', `collector-assigned-${pickup.id}`);
      }
    });
    savePickupStatusCache(nextPickups);
    return;
  }

  const changed = [];
  for (const [id, nextStatus] of after.entries()) {
    const previousStatus = before.get(id) || pickupStatusCache[id];
    if (previousStatus && previousStatus !== nextStatus) {
      changed.push({ id, previousStatus, nextStatus });
      const pickup = nextPickups.find((p) => String(p.id) === id);
      addNotification(
        'Request Status Updated',
        `Your pickup request ${id} status changed from ${previousStatus} to ${nextStatus}.`,
        'success',
        `status-${id}-${previousStatus}-${nextStatus}`
      );

      if (pickup?.collectorId) {
        addNotification('Collector Assigned', `A collector has been assigned to your request ${id}.`, 'info', `collector-assigned-${id}`);
      }

      if (String(nextStatus).toLowerCase() === 'completed') {
        addNotification(
          'Pickup Completed',
          `Request ${id} is completed. Please submit your feedback from History.`,
          'success',
          `feedback-prompt-${id}`
        );
      }
    }
  }

  savePickupStatusCache(nextPickups);

  if (!changed.length) {
    return;
  }

  const latest = changed[changed.length - 1];
  showNotice('success', `Live update: Request ${latest.id} changed from ${latest.previousStatus} to ${latest.nextStatus}.`);
}

async function startLivePickupStatusSync() {
  if (liveSyncTimerId) {
    clearInterval(liveSyncTimerId);
  }

  let refreshInProgress = false;

  liveSyncTimerId = setInterval(async () => {
    if (refreshInProgress) {
      return;
    }

    refreshInProgress = true;
    try {
      const pickupRes = await pickupAPI.getAll({ limit: 300 });
      applyPickupUpdates(pickupRes.pickups || [], { notifyChanges: true });
    } catch {
      // Keep live sync silent on transient failures.
    } finally {
      refreshInProgress = false;
    }
  }, LIVE_PICKUP_REFRESH_MS);
}

function renderTracking() {
  const status = document.getElementById('latestTrackingStatus');
  const animated = document.getElementById('animatedTrackingStatus');
  const latest = requests.length ? requests[0] : null;
  if (!latest) {
    if (status) status.textContent = 'No requests yet.';
    if (animated) animated.textContent = 'Status not available';
    return;
  }

  const text = `${latest.status} (Request ${latest.id})`;
  if (status) status.textContent = text;
  if (animated) animated.textContent = latest.status;
}

function renderHistory() {
  const tbody = document.getElementById('requestRows');
  if (!tbody) return;

  if (!requests.length) {
    tbody.innerHTML = '<tr><td colspan="8">No pickup requests yet.</td></tr>';
    return;
  }

  const imageCell = (src, label) => {
    if (!src) {
      return '-';
    }
    return `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${label}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;border:1px solid #d5e1d8;" /></a>`;
  };

  tbody.innerHTML = requests
    .map((r) => `
      <tr>
        <td>${r.id}</td>
        <td>${r.wasteType || '-'}</td>
        <td>${new Date(r.preferredDate || r.createdAt).toLocaleString()}</td>
        <td>${r.address || '-'}</td>
        <td><span class="${statusClass(r.status)}">${r.status}</span></td>
        <td>${imageCell(r.wasteImage, 'Waste image')}</td>
        <td>${imageCell(r.collectorProofImage, 'Collector proof')}</td>
        <td>${(() => {
          if (r.status !== 'Completed') {
            return 'Waiting';
          }

          const item = getFeedbackByPickupId(r.id);
          if (!item) {
            return 'Not submitted';
          }

          const rating = Math.max(1, Math.min(5, Number(item.rating || 0)));
          const stars = '★'.repeat(rating);
          const safeComment = String(item.comment || '').trim();
          const moderation = String(item.moderationStatus || 'Pending');
          const pillClass = getModerationPillClass(moderation);
          return `${stars} ${rating}/5${safeComment ? ` - ${safeComment}` : ''}<br/><span class="status-pill ${pillClass}">${moderation}</span>`;
        })()}</td>
      </tr>
    `)
    .join('');
}

function renderPaymentHistory() {
  const tbody = document.getElementById('paymentHistoryRows');
  if (!tbody) return;
  if (!payments.length) {
    tbody.innerHTML = '<tr><td colspan="7">No payment records yet.</td></tr>';
    return;
  }

  tbody.innerHTML = payments
    .map((p) => {
      const isRetryable = p.status === 'Pending' || p.status === 'Failed';
      return `<tr>
        <td>${p.pickupRequestId || '-'}</td>
        <td>${p.method || '-'}</td>
        <td>₹${formatCurrency(p.amount)}</td>
        <td>${p.status || '-'}</td>
        <td>${p.transactionId || '-'}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
        <td>${isRetryable ? `<button class="btn btn-outline" data-payment-retry="${p.id}">Retry</button>` : '-'}</td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-payment-retry]').forEach((button) => {
    button.addEventListener('click', async () => {
      const paymentId = button.getAttribute('data-payment-retry');
      const payment = payments.find((x) => String(x.id) === String(paymentId));
      if (!payment) return;

      pendingPickupId = payment.pickupRequestId;
      sessionStorage.setItem(PENDING_PAYMENT_PICKUP_KEY, pendingPickupId);
      sessionStorage.setItem(OPEN_PAYMENT_PANEL_KEY, '1');
      openPaymentPanel();
      setPaymentFormEnabled(true);
      document.getElementById('paymentMethod').value = payment.method;
      document.querySelectorAll('.payment-method-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-method') === payment.method);
      });
      applyPaymentMethodUI(payment.method);
      updatePaymentAmount();
      showPaymentNotice('success', 'Retrying payment for previous transaction.');
    });
  });
}

function renderComplaintHistory() {
  const tbody = document.getElementById('complaintHistoryRows');
  if (!tbody) return;
  if (!complaints.length) {
    tbody.innerHTML = '<tr><td colspan="4">No complaints submitted yet.</td></tr>';
    return;
  }

  tbody.innerHTML = complaints
    .map((c) => `<tr><td>${c.subject}</td><td>${c.message}</td><td>${c.status}</td><td>${new Date(c.createdAt).toLocaleString()}</td></tr>`)
    .join('');
}

async function loadProfile() {
  const session = getSessionUser();
  const response = await userAPI.getById(session.id);
  const user = response.user;

  const set = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.value = value || '';
  };

  set('profileNameInput', user.name);
  set('profilePhoneInput', user.phone);
  set('profileAddressInput', user.address);
  set('profileEmailInput', user.email);

  const imagePreview = document.getElementById('profilePreview');
  if (imagePreview) {
    if (user.profileImage) {
      imagePreview.src = user.profileImage;
      imagePreview.classList.remove('hidden');
    } else {
      imagePreview.src = '';
      imagePreview.classList.add('hidden');
    }
  }

  const previewSet = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value || '-';
  };
  previewSet('previewName', user.name);
  previewSet('previewEmail', user.email);
  previewSet('previewPhone', user.phone);
  previewSet('previewAddress', user.address);
  document.getElementById('profileDetailsPreview')?.classList.remove('hidden');

  const role = document.getElementById('profileRole');
  if (role) role.textContent = user.role || 'user';

  const welcome = document.getElementById('userWelcome');
  if (welcome) welcome.textContent = `Welcome back, ${user.name}`;
}

function openPaymentPanel() {
  pendingPickupId = String(pendingPickupId || sessionStorage.getItem(PENDING_PAYMENT_PICKUP_KEY) || '').trim();
  activateUserSection('paymentSection');

  const paymentSection = document.getElementById('paymentSection');
  if (paymentSection) {
    paymentSection.classList.remove('hidden');
  }

  ['profileSection', 'trackingSection', 'pickupSection', 'complaintsSection', 'historySection', 'notificationsSection'].forEach((id) => {
    document.getElementById(id)?.classList.add('hidden');
  });

  document.body.classList.add('overlay-lock');
  sessionStorage.setItem(OPEN_PAYMENT_PANEL_KEY, '1');

  resetPaymentPanelState();
  updatePaymentAmount();

  const methodInput = document.getElementById('paymentMethod');
  if (methodInput) methodInput.value = 'UPI';

  document.querySelectorAll('.payment-method-btn').forEach((btn) => btn.classList.remove('active'));
  const methodBtn = document.querySelector('.payment-method-btn[data-method="UPI"]');
  if (methodBtn) methodBtn.classList.add('active');
  applyPaymentMethodUI('UPI');
  setPaymentFormEnabled(Boolean(pendingPickupId));

  if (!pendingPickupId) {
    showPaymentNotice('error', 'Create a pickup request first, then complete the payment.');
  }
}

function showPaymentPanelForMethod(method) {
  const paymentSection = document.getElementById('paymentSection');
  if (!paymentSection) return;

  activateUserSection('paymentSection');
  paymentSection.classList.remove('hidden');

  const methodInput = document.getElementById('paymentMethod');
  if (methodInput) methodInput.value = method;

  document.querySelectorAll('.payment-method-btn').forEach((btn) => btn.classList.remove('active'));
  const methodBtn = document.querySelector(`.payment-method-btn[data-method="${method}"]`);
  if (methodBtn) methodBtn.classList.add('active');

  applyPaymentMethodUI(method);
  updatePaymentAmount();
  updatePayButtonLabel();
}



function closePaymentPanel() {
  const paymentSection = document.getElementById('paymentSection');
  if (paymentSection) {
    paymentSection.classList.add('hidden');
  }
  document.body.classList.remove('overlay-lock', 'payment-modal-open');
  sessionStorage.removeItem(OPEN_PAYMENT_PANEL_KEY);
  resetPaymentPanelState();
  hidePaymentNotice();
}

function setPaymentFormEnabled(enabled) {
  const buttons = document.querySelectorAll('.payment-method-btn');
  buttons.forEach((btn) => {
    btn.disabled = !enabled;
  });

  const formFields = document.querySelectorAll('#paymentForm input, #paymentForm select, #paymentForm textarea');
  formFields.forEach((field) => {
    field.disabled = !enabled;
  });

  const form = document.getElementById('paymentForm');
  const submitButton = form?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = !enabled;
    if (!enabled) {
      submitButton.textContent = 'Preparing pickup...';
    } else {
      updatePayButtonLabel();
    }
  }

  const detailsBlock = document.getElementById('paymentDetailsBlock');
  if (!enabled && detailsBlock) {
    detailsBlock.classList.add('hidden');
  }
}

function bindPaymentButtons() {
  const methodInput = document.getElementById('paymentMethod');
  const buttons = document.querySelectorAll('.payment-method-btn');

  if (buttons.length === 0) {
    return;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const method = String(btn.getAttribute('data-method') || 'UPI');
      if (methodInput) methodInput.value = method;
      document.querySelectorAll('.payment-method-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyPaymentMethodUI(method);
      updatePayButtonLabel();
    });
  });

}

function bindForms() {
  document.getElementById('paymentCloseBtn')?.addEventListener('click', () => {
    closePaymentPanel();
    activateUserSection(pendingPickupId ? 'trackingSection' : 'pickupSection');
  });

  document.getElementById('pickupForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const preferredDate = String(formData.get('dateTime') || '');
      if (!preferredDate) {
        showNotice('error', 'Please choose a pickup date and time.');
        return;
      }

      const selectedDate = parseDateTimeLocal(preferredDate);
      const now = new Date();
      now.setSeconds(0, 0);
      if (!selectedDate || selectedDate < now) {
        showNotice('error', 'Pickup date must be an upcoming date and time.');
        return;
      }

      pendingPickupId = '';

      showNotice('success', 'Submitting your pickup request...');
      isPreparingPickupPayment = true;

      let wasteImage = '';
      const wasteImageFile = formData.get('wasteImage');
      if (wasteImageFile instanceof File && wasteImageFile.size > 0) {
        wasteImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read waste image.'));
          reader.readAsDataURL(wasteImageFile);
        });
      }

      const created = await pickupAPI.create({
        wasteType: String(formData.get('wasteType') || ''),
        quantity: 1,
        address: String(formData.get('address') || ''),
        preferredDate,
        notes: String(formData.get('notes') || ''),
        wasteImage
      });

      isPreparingPickupPayment = false;
      pendingPickupId = created.pickup?.id || '';
      sessionStorage.setItem(PENDING_PAYMENT_PICKUP_KEY, pendingPickupId);
      sessionStorage.setItem(OPEN_PAYMENT_PANEL_KEY, '1');
      await loadAllData();
      document.getElementById('pickupForm').style.display = 'none';
      openPaymentPanel();
      showNotice('success', `Pickup request ${created.pickup?.id || ''} submitted successfully. Please complete the payment now.`);
    } catch (error) {
      isPreparingPickupPayment = false;
      showNotice('error', error.message || 'Failed to create pickup request.');
    }
  });

  document.getElementById('complaintForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await complaintAPI.create({
        subject: String(formData.get('subject') || ''),
        message: String(formData.get('message') || ''),
        priority: 'Medium'
      });
      event.currentTarget.reset();
      showNotice('success', 'Complaint submitted successfully.');
      await loadAllData();
    } catch (error) {
      showNotice('error', error.message || 'Failed to submit complaint.');
    }
  });

  document.getElementById('reviewForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await submitReviewFromForm();
  });

  document.getElementById('paymentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!pendingPickupId) {
      showPaymentNotice('error', 'Create a pickup request first, then complete the payment.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const method = String(formData.get('paymentMethod') || '').trim();

    if (!method) {
      showPaymentNotice('error', 'Choose a payment method to continue.');
      return;
    }

    const paymentDetails = getPaymentMethodDetails(method);
    if (!paymentDetails.ok) {
      showPaymentNotice('error', paymentDetails.error);
      return;
    }

    try {
      const completedPickupId = pendingPickupId;
      const response = await paymentAPI.create({
        amount: currentPaymentAmount,
        method,
        pickupRequestId: completedPickupId,
        transactionId: paymentDetails.transactionId,
        reference: paymentDetails.reference
      });

      pendingPickupId = '';
      sessionStorage.removeItem(PENDING_PAYMENT_PICKUP_KEY);
      sessionStorage.removeItem(OPEN_PAYMENT_PANEL_KEY);
      closePaymentPanel();
      showPaymentSuccessModal(completedPickupId || response.payment?.pickupRequestId || 'N/A');
      resetPickupFormAfterPayment();
      showNotice('success', 'Payment completed successfully.');
      await loadAllData();
    } catch (error) {
      showPaymentNotice('error', error.message || 'Payment failed.');
    }
  });

  document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const session = getSessionUser();
    const formData = new FormData(event.currentTarget);

    let profileImage = '';
    const selectedImage = formData.get('profileImage');
    if (selectedImage instanceof File && selectedImage.size > 0) {
      profileImage = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read profile image.'));
        reader.readAsDataURL(selectedImage);
      });
    } else {
      const currentPreview = document.getElementById('profilePreview');
      if (currentPreview?.src && !currentPreview.classList.contains('hidden')) {
        profileImage = currentPreview.src;
      }
    }

    try {
      const response = await userAPI.updateProfile(session.id, {
        name: String(formData.get('profileNameInput') || ''),
        phone: String(formData.get('profilePhoneInput') || ''),
        address: String(formData.get('profileAddressInput') || ''),
        email: String(formData.get('profileEmailInput') || ''),
        profileImage
      });
      localStorage.setItem('wds_session_v1', JSON.stringify(response.user));
      showProfileNotice('success', 'Profile updated successfully.');
      await loadProfile();
    } catch (error) {
      showProfileNotice('error', error.message || 'Failed to update profile.');
    }
  });

  document.getElementById('changePasswordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const session = getSessionUser();
    const formData = new FormData(event.currentTarget);
    const current = String(formData.get('currentPassword') || '');
    const next = String(formData.get('newPassword') || '');
    const confirm = String(formData.get('confirmNewPassword') || '');

    if (next.length < 8) {
      showPasswordNotice('error', 'New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      showPasswordNotice('error', 'Passwords do not match.');
      return;
    }

    try {
      await userAPI.changePassword(session.id, current, next);
      event.currentTarget.reset();
      showPasswordNotice('success', 'Password changed successfully.');
    } catch (error) {
      showPasswordNotice('error', error.message || 'Failed to change password.');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const successOverlay = document.getElementById('paymentSuccessOverlay');
      if (successOverlay && !successOverlay.classList.contains('hidden')) {
        // Keep success modal visible until user clicks Continue or Track.
        return;
      }
      closePaymentPanel();
      activateUserSection(pendingPickupId ? 'trackingSection' : 'pickupSection');
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const session = getActiveSessionUser();
  if (!session || session.role !== 'user') {
    window.location.href = 'auth.html';
    return;
  }

  pendingPickupId = String(sessionStorage.getItem(PENDING_PAYMENT_PICKUP_KEY) || '').trim();

  setupSections();
  bindProfilePreview();
  setupWasteTypes();

  // Load notification read status from localStorage
  const savedReadStatus = localStorage.getItem(NOTIFICATION_READ_STATUS_KEY);
  if (savedReadStatus) {
    try {
      notificationReadStatus = JSON.parse(savedReadStatus);
    } catch {
      notificationReadStatus = {};
    }
  }

  const savedPickupStatus = localStorage.getItem(PICKUP_STATUS_CACHE_KEY);
  if (savedPickupStatus) {
    try {
      const parsed = JSON.parse(savedPickupStatus);
      pickupStatusCache = parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      pickupStatusCache = {};
    }
  }

  setupPickupDateConstraints();
  bindPaymentInputMasks();
  bindForms();
  bindPaymentButtons();

  try {
    await loadSystemSettings();
    await Promise.all([loadProfile(), loadAllData()]);
    updateNotificationBadge();
    const keepPaymentOpen = sessionStorage.getItem(OPEN_PAYMENT_PANEL_KEY) === '1';
    if (pendingPickupId || keepPaymentOpen) {
      openPaymentPanel();
      setPaymentFormEnabled(Boolean(pendingPickupId));
    }
    await startLivePickupStatusSync();
  } catch (error) {
    showNotice('error', error.message || 'Failed to load user dashboard.');
  }

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();
    window.location.href = 'auth.html';
  });
});

window.addEventListener('beforeunload', () => {
  if (liveSyncTimerId) {
    clearInterval(liveSyncTimerId);
    liveSyncTimerId = null;
  }
});
