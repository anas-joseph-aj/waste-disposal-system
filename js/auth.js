import { getActiveSessionUser, login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function normalizeAuthError(error, fallback = 'Something went wrong. Please try again.') {
  const message = String(error?.message || '').trim();
  if (!message) {
    return fallback;
  }

  const lowered = message.toLowerCase();
  const hasUrl = /https?:\/\//i.test(message);
  const hasAnchorTag = /<\s*a\b/i.test(message);

  if (hasUrl || hasAnchorTag) {
    return 'Unable to complete request right now. Please try again.';
  }

  if (lowered.includes('failed to fetch') || lowered.includes('networkerror') || lowered.includes('cors')) {
    return 'Unable to connect to server. Please try again in a few moments.';
  }

  if (lowered.includes('temporarily unavailable') || lowered.includes('service unavailable')) {
    return 'Service is temporarily unavailable. Please try again in a few moments.';
  }

  if (lowered.includes('invalid email or password')) {
    return 'Invalid email or password.';
  }

  if (lowered.includes('required')) {
    return 'Please enter email or employee ID and password.';
  }

  return message.length > 180 ? fallback : message;
}

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
  target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setFormBusy(form, busy, busyText) {
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  if (busy) {
    submitBtn.dataset.originalText = submitBtn.textContent || 'Submit';
    submitBtn.disabled = true;
    submitBtn.textContent = busyText;
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent || 'Submit';
  }
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

function sanitizePhoneInput(input) {
  if (!input) {
    return;
  }

  input.addEventListener('input', () => {
    const digits = String(input.value || '').replace(/\D/g, '').slice(0, 10);
    input.value = digits;
  });
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(String(phone || ''));
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.protocol === 'file:') {
    showMessage(
      'error',
      'Open this page via a local server, not file://. Run `npm run dev` in the project root and open http://localhost:3000/auth.html'
    );
  }

  // Check if already logged in
  const user = getActiveSessionUser();
  if (user) {
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const registerPhoneInput = document.getElementById('phone');

  sanitizePhoneInput(registerPhoneInput);

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      setFormBusy(loginForm, true, 'Logging in...');

      try {
        const user = await login(
          String(formData.get('email') || '').trim(),
          String(formData.get('password') || '')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        window.location.href = dashboardFor(user.role);
      } catch (error) {
        showMessage('error', normalizeAuthError(error, 'Login failed. Please try again.'));
      } finally {
        setFormBusy(loginForm, false);
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');
      const phone = String(formData.get('phone') || '').replace(/\D/g, '');

      setFormBusy(registerForm, true, 'Registering...');

      if (!isValidPhone(phone)) {
        showMessage('error', 'Phone number must be exactly 10 digits.');
        setFormBusy(registerForm, false);
        return;
      }

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        setFormBusy(registerForm, false);
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        setFormBusy(registerForm, false);
        return;
      }

      try {
        const user = await register(
          String(formData.get('name') || '').trim(),
          String(formData.get('regEmail') || '').trim(),
          phone,
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting...');
        registerForm.reset();
        window.location.href = dashboardFor(user.role);
      } catch (error) {
        showMessage('error', normalizeAuthError(error, 'Registration failed. Please try again.'));
      } finally {
        setFormBusy(registerForm, false);
      }
    });
  }

  // Forgot password button
  const showForgotPasswordBtn = document.getElementById('showForgotPassword');
  const forgotPasswordPanel = document.getElementById('forgotPasswordPanel');
  
  if (showForgotPasswordBtn && forgotPasswordPanel) {
    showForgotPasswordBtn.addEventListener('click', () => {
      forgotPasswordPanel.classList.toggle('hidden');
    });
  }

  // Forgot email form
  const forgotEmailForm = document.getElementById('forgotEmailForm');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  
  if (forgotEmailForm) {
    forgotEmailForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('forgotEmail').value;

      try {
        await authAPI.checkEmail(email);
        showMessage('success', 'Email verified. Enter your new password.');
        forgotEmailForm.classList.add('hidden');
        resetPasswordForm.classList.remove('hidden');
      } catch (error) {
        showMessage('error', normalizeAuthError(error, 'Email not found'));
      }
    });
  }

  // Reset password form
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('forgotEmail').value;
      const newPassword = document.getElementById('resetNewPassword').value;
      const confirmPassword = document.getElementById('resetConfirmPassword').value;

      if (newPassword !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await authAPI.resetPassword(email, newPassword);
        showMessage('success', 'Password reset successfully. Redirecting to login...');
        forgotPasswordPanel.classList.add('hidden');
        forgotEmailForm.classList.remove('hidden');
        resetPasswordForm.classList.add('hidden');
        forgotEmailForm.reset();
        resetPasswordForm.reset();
      } catch (error) {
        showMessage('error', normalizeAuthError(error, 'Password reset failed. Please try again.'));
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
