import { getActiveSessionUser } from './services/auth.js';
import { paymentAPI } from './services/api.js';

const PENDING_PAYMENT_PICKUP_KEY = 'wds_pending_payment_pickup_id';
const OPEN_PAYMENT_PANEL_KEY = 'wds_open_payment_panel';
const ADMIN_PAYMENT_FEE_KEY = 'wds_admin_payment_fee';
const PAYMENT_RESULT_KEY = 'wds_last_payment_result';
const PAYMENT_STATUS_KEY = 'wds_payment_status';
let paymentSuccessLocked = false;

function showNotice(type, message) {
  const node = document.getElementById('paymentNotice');
  if (!node) {
    return;
  }

  node.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  node.textContent = message;
  node.classList.remove('hidden');
}

function getPickupId() {
  const params = new URLSearchParams(window.location.search);
  const urlPickupId = String(params.get('pickupId') || '').trim();
  if (urlPickupId) {
    return urlPickupId;
  }

  const sessionPickupId = String(sessionStorage.getItem(PENDING_PAYMENT_PICKUP_KEY) || '').trim();
  if (sessionPickupId) {
    return sessionPickupId;
  }

  return String(localStorage.getItem(PENDING_PAYMENT_PICKUP_KEY) || '').trim();
}

function getPaymentAmount() {
  const params = new URLSearchParams(window.location.search);
  const queryAmount = Number(params.get('amount') || NaN);
  if (Number.isFinite(queryAmount) && queryAmount > 0) {
    return queryAmount;
  }

  const storedFee = Number(localStorage.getItem(ADMIN_PAYMENT_FEE_KEY) || 50);
  return Number.isFinite(storedFee) && storedFee > 0 ? storedFee : 50;
}

function isValidUpiId(upiId) {
  return /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
}

function isValidTxnId(txnId) {
  return /^[A-Za-z0-9_-]{6,40}$/.test(txnId);
}

function updateStatusLocalStorage(payload) {
  localStorage.setItem(
    PAYMENT_STATUS_KEY,
    JSON.stringify({
      status: 'Paid',
      payment: 'Completed',
      pickupRequestId: payload.pickupRequestId,
      amount: payload.amount,
      method: payload.method,
      transactionId: payload.transactionId,
      paidAt: new Date().toISOString()
    })
  );

  localStorage.setItem(
    PAYMENT_RESULT_KEY,
    JSON.stringify({
      success: true,
      message: 'Payment Successful ✅',
      pickupRequestId: payload.pickupRequestId,
      amount: payload.amount,
      paidAt: new Date().toISOString()
    })
  );

  // Clear pending payment flags after successful payment.
  localStorage.removeItem(PENDING_PAYMENT_PICKUP_KEY);
  sessionStorage.removeItem(PENDING_PAYMENT_PICKUP_KEY);
  sessionStorage.removeItem(OPEN_PAYMENT_PANEL_KEY);
}

function setButtonLoading(isLoading) {
  const button = document.getElementById('payNowBtn');
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? 'Processing...' : 'Pay Now';
}

function showSuccessOverlay(pickupRequestId) {
  const overlay = document.getElementById('paymentSuccessOverlay');
  const messageNode = document.getElementById('paymentSuccessMessage');
  const continueBtn = document.getElementById('paymentSuccessContinueBtn');
  const trackBtn = document.getElementById('paymentSuccessTrackBtn');

  if (!overlay) {
    return;
  }

  if (messageNode) {
    messageNode.textContent = `Request ${pickupRequestId || 'N/A'} is submitted and confirmed.`;
  }

  const freshContinueBtn = continueBtn ? continueBtn.cloneNode(true) : null;
  const freshTrackBtn = trackBtn ? trackBtn.cloneNode(true) : null;

  if (continueBtn && freshContinueBtn) {
    continueBtn.replaceWith(freshContinueBtn);
    freshContinueBtn.addEventListener('click', () => {
      paymentSuccessLocked = false;
      overlay.classList.add('hidden');
      document.body.classList.remove('overlay-lock');
      window.location.href = 'user-dashboard.html?section=pickupSection&payment=success';
    });
  }

  if (trackBtn && freshTrackBtn) {
    trackBtn.replaceWith(freshTrackBtn);
    freshTrackBtn.addEventListener('click', () => {
      paymentSuccessLocked = false;
      overlay.classList.add('hidden');
      document.body.classList.remove('overlay-lock');
      window.location.href = 'user-dashboard.html?section=trackingSection&payment=success';
    });
  }

  paymentSuccessLocked = true;
  overlay.classList.remove('hidden');
  document.body.classList.add('overlay-lock');
}

function bindPaymentForm() {
  const form = document.getElementById('paymentForm');
  const amountInput = document.getElementById('paymentAmount');
  const summary = document.getElementById('paymentSummary');

  if (!form || !amountInput || !summary) {
    return;
  }

  const pickupRequestId = getPickupId();
  const amount = getPaymentAmount();

  amountInput.value = amount.toFixed(2);
  summary.innerHTML = `
    <div><strong>Payment Summary</strong></div>
    <div>Pickup Request ID: ${pickupRequestId || 'N/A'}</div>
    <div><strong>Total: ₹${amount.toFixed(2)}</strong></div>
  `;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const upiId = String(document.getElementById('upiId')?.value || '').trim();
    const upiTxnId = String(document.getElementById('upiTxnId')?.value || '').trim();

    if (!pickupRequestId) {
      showNotice('error', 'No pending pickup request found for payment.');
      return;
    }

    if (!isValidUpiId(upiId)) {
      showNotice('error', 'Please enter a valid UPI ID (example@bank).');
      return;
    }

    if (!isValidTxnId(upiTxnId)) {
      showNotice('error', 'Please enter a valid transaction ID.');
      return;
    }

    setButtonLoading(true);

    try {
      await paymentAPI.create({
        amount,
        method: 'UPI',
        pickupRequestId,
        transactionId: upiTxnId,
        reference: `UPI ID ${upiId}`
      });

      updateStatusLocalStorage({
        pickupRequestId,
        amount,
        method: 'UPI',
        transactionId: upiTxnId
      });

      showNotice('success', 'Payment Successful ✅');
      showSuccessOverlay(pickupRequestId);
    } catch (error) {
      showNotice('error', error?.message || 'Payment failed. Please try again.');
    } finally {
      setButtonLoading(false);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const session = getActiveSessionUser();
  if (!session) {
    window.location.href = 'auth.html';
    return;
  }

  bindPaymentForm();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && paymentSuccessLocked) {
      event.preventDefault();
    }
  });
});
