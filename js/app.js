import { getActiveSessionUser, login, register, logout } from "./services/auth.js";
import { authAPI, pickupAPI } from "./services/api.js";
import { initSmartChatbot } from "./chatbot.js";

const PUBLIC_PAGES = ["index.html", "about.html", "services.html"];

function currentPage() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "index.html";
}

function applyApiBaseFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const apiBase = String(params.get("apiBase") || "").trim();
  if (!apiBase) {
    return;
  }

  localStorage.setItem("wds_api_base", apiBase.replace(/\/+$/, ""));
  params.delete("apiBase");

  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", cleanUrl);
}

function setActiveNavLink() {
  const page = currentPage();
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });
}

function bindMobileNav() {
  const toggle = document.getElementById("mobileToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) {
    return;
  }

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });
}

function getDashboardPath(role) {
  if (role === "admin") {
    return "admin-dashboard.html";
  }
  if (role === "collector") {
    return "collector-dashboard.html";
  }
  return "user-dashboard.html";
}

function normalizeAuthError(error, fallback = "Something went wrong. Please try again.") {
  const message = String(error?.message || "").trim();
  if (!message) {
    return fallback;
  }

  const lowered = message.toLowerCase();
  const hasUrl = /https?:\/\//i.test(message);
  const hasAnchorTag = /<\s*a\b/i.test(message);

  if (hasUrl || hasAnchorTag) {
    return "Unable to complete request right now. Please try again.";
  }

  if (lowered.includes("failed to fetch") || lowered.includes("networkerror") || lowered.includes("cors")) {
    return "Unable to connect to server. Please try again in a few moments.";
  }

  if (lowered.includes("temporarily unavailable") || lowered.includes("service unavailable")) {
    return "Service is temporarily unavailable. Please try again in a few moments.";
  }

  if (lowered.includes("invalid email or password")) {
    return "Invalid email or password.";
  }

  if (lowered.includes("required")) {
    return "Please enter email or employee ID and password.";
  }

  return message.length > 180 ? fallback : message;
}

function sanitizePhoneInput(input) {
  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    const digits = String(input.value || "").replace(/\D/g, "").slice(0, 10);
    input.value = digits;
  });
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(String(phone || ""));
}

function bindAuthButtons() {
  const session = getActiveSessionUser();
  const authArea = document.getElementById("authArea");
  if (!authArea) {
    return;
  }

  if (!session) {
    authArea.innerHTML = `
      <a class="btn btn-outline" href="auth.html">Login</a>
      <a class="btn btn-primary" href="auth.html">Register</a>
    `;
    return;
  }

  let profileHref = "user-dashboard.html?section=profileSection&profileOnly=1";
  if (session.role === "admin") {
    profileHref = "admin-dashboard.html?section=adminProfileSection";
  }
  if (session.role === "collector") {
    profileHref = "collector-dashboard.html?section=collectorProfileSection";
  }

  const initials = String(session.name || "U")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

  const hasProfileImage = Boolean(session.profileImage);
  const profileAvatarMarkup = hasProfileImage
    ? `<img src="${session.profileImage}" alt="${session.name || "Profile"}" class="profile-nav-avatar has-image" />`
    : `<span class="profile-nav-avatar">${initials}</span>`;

  authArea.innerHTML = `
    <a class="profile-nav-link" href="${profileHref}" title="Open profile">
      ${profileAvatarMarkup}
    </a>
    <button class="btn btn-danger" id="logoutBtn" type="button">Logout</button>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "index.html";
    });
  }
}

function currentIsPublicPage() {
  return PUBLIC_PAGES.includes(currentPage());
}

function applyFeatureLock() {
  const session = getActiveSessionUser();
  const lockTargets = document.querySelectorAll(".requires-auth");
  if (!lockTargets.length) {
    return;
  }

  if (session) {
    lockTargets.forEach((node) => node.classList.remove("hidden"));
    document.getElementById("featureLockBanner")?.remove();
    return;
  }

  lockTargets.forEach((node) => node.classList.add("hidden"));

  const main = document.querySelector("main.page");
  if (!main || document.getElementById("featureLockBanner")) {
    return;
  }

  const banner = document.createElement("section");
  banner.id = "featureLockBanner";
  banner.className = "container";
  banner.style.marginTop = "14px";
  banner.innerHTML = `
    <div class="card auth-lock-card">
      <h2>Login Required To Access Full Features</h2>
      <p>Please login or register to view advanced workflow, service modules, and dashboard-level features.</p>
      <button class="btn btn-primary" id="lockBannerLoginBtn" type="button">Login / Register</button>
    </div>
  `;
  main.prepend(banner);
  document.getElementById("lockBannerLoginBtn")?.addEventListener("click", () => openAuthPopup());
}

function openAuthPopup() {
  if (document.getElementById("authPopupOverlay")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "authPopupOverlay";
  overlay.className = "auth-popup-overlay";
  overlay.innerHTML = `
    <div class="auth-popup-card auth-popup-premium">
      <button class="auth-popup-close" id="closeAuthPopup" type="button" aria-label="Close">x</button>
      <div class="popup-auth-grid">
        <div class="popup-auth-brand">
          <span class="badge">Secure Access</span>
          <h3>Waste Operations Portal</h3>
          <p>Login to access role-based dashboards, pickup tracking, payment workflow, and operational reports.</p>
          <div class="grid" style="margin-top: 10px;">
            <div class="card"><strong>User</strong><p>Requests, tracking, complaints, payments.</p></div>
            <div class="card"><strong>Collector</strong><p>Assigned routes and tracking updates.</p></div>
            <div class="card"><strong>Admin</strong><p>Approvals, analytics, and management.</p></div>
          </div>
        </div>

        <div class="popup-auth-forms">
          <div class="subnav" style="margin-bottom:10px;">
            <button class="subnav-btn active" id="popupTabLogin" type="button">Login</button>
            <button class="subnav-btn" id="popupTabRegister" type="button">Register</button>
          </div>

          <div id="popupLoginPane">
            <h3>Login</h3>
            <form id="popupLoginForm">
              <div class="field">
                <label for="popupLoginEmail">Email or Employee ID</label>
                <input id="popupLoginEmail" name="email" type="text" required />
              </div>
              <div class="field password-wrap">
                <label for="popupLoginPassword">Password</label>
                <input id="popupLoginPassword" name="password" type="password" required />
                <button class="password-toggle" type="button" data-toggle-target="popupLoginPassword">Show</button>
              </div>
              <div class="actions-row">
                <button class="btn btn-primary" type="submit">Login</button>
                <button class="btn btn-outline" id="popupForgotBtn" type="button">Forgot Password?</button>
              </div>
            </form>
          </div>

          <div id="popupRegisterPane" class="hidden">
            <h3>Register</h3>
            <form id="popupRegisterForm">
              <div class="field">
                <label for="popupRegName">Name</label>
                <input id="popupRegName" name="name" required />
              </div>
              <div class="field">
                <label for="popupRegEmail">Email</label>
                <input id="popupRegEmail" name="email" type="email" required />
              </div>
              <div class="field">
                <label for="popupRegPhone">Phone</label>
                <input id="popupRegPhone" name="phone" type="tel" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" title="Enter exactly 10 digits" placeholder="Enter 10-digit phone number" required />
              </div>
              <div class="field password-wrap">
                <label for="popupRegPassword">Password</label>
                <input id="popupRegPassword" name="password" type="password" required />
                <button class="password-toggle" type="button" data-toggle-target="popupRegPassword">Show</button>
              </div>
              <div class="field password-wrap">
                <label for="popupRegConfirmPassword">Confirm Password</label>
                <input id="popupRegConfirmPassword" name="confirmPassword" type="password" required />
                <button class="password-toggle" type="button" data-toggle-target="popupRegConfirmPassword">Show</button>
              </div>
              <button class="btn btn-primary" type="submit">Register</button>
            </form>
          </div>

          <div id="popupForgotPane" class="hidden">
            <h3>Reset Password</h3>
            <form id="popupForgotEmailForm">
              <div class="field">
                <label for="popupForgotEmail">Registered Email</label>
                <input id="popupForgotEmail" name="email" type="email" required />
              </div>
              <button class="btn btn-outline" type="submit">Verify Email</button>
            </form>

            <form id="popupResetPasswordForm" class="hidden" style="margin-top: 8px;">
              <div class="field password-wrap">
                <label for="popupNewPassword">Create New Password</label>
                <input id="popupNewPassword" name="newPassword" type="password" required />
                <button class="password-toggle" type="button" data-toggle-target="popupNewPassword">Show</button>
              </div>
              <div class="field password-wrap">
                <label for="popupConfirmNewPassword">Confirm Password</label>
                <input id="popupConfirmNewPassword" name="confirmPassword" type="password" required />
                <button class="password-toggle" type="button" data-toggle-target="popupConfirmNewPassword">Show</button>
              </div>
              <button class="btn btn-primary" type="submit">Update Password</button>
            </form>
          </div>

          <div id="popupAuthNotice" class="notice notice-success hidden" style="margin-top:10px;"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  function notice(type, text) {
    const node = document.getElementById("popupAuthNotice");
    if (!node) {
      return;
    }
    node.className = `notice ${type === "error" ? "notice-error" : "notice-success"}`;
    node.textContent = text;
    node.classList.remove("hidden");
  }

  document.getElementById("closeAuthPopup")?.addEventListener("click", () => {
    overlay.remove();
  });

  const loginPane = document.getElementById("popupLoginPane");
  const registerPane = document.getElementById("popupRegisterPane");
  const forgotPane = document.getElementById("popupForgotPane");
  const tabLogin = document.getElementById("popupTabLogin");
  const tabRegister = document.getElementById("popupTabRegister");
  const popupForgotBtn = document.getElementById("popupForgotBtn");

  let forgotEmail = "";

  tabLogin?.addEventListener("click", () => {
    loginPane?.classList.remove("hidden");
    registerPane?.classList.add("hidden");
    forgotPane?.classList.add("hidden");
    tabLogin.classList.add("active");
    tabRegister?.classList.remove("active");
  });

  tabRegister?.addEventListener("click", () => {
    registerPane?.classList.remove("hidden");
    loginPane?.classList.add("hidden");
    forgotPane?.classList.add("hidden");
    tabRegister.classList.add("active");
    tabLogin?.classList.remove("active");
  });

  popupForgotBtn?.addEventListener("click", () => {
    forgotPane?.classList.remove("hidden");
    loginPane?.classList.add("hidden");
    registerPane?.classList.add("hidden");
    tabLogin?.classList.remove("active");
    tabRegister?.classList.remove("active");
  });

  overlay.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-toggle-target");
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) {
        return;
      }
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });

  sanitizePhoneInput(document.getElementById("popupRegPhone"));

  document.getElementById("popupLoginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      const user = await login(String(data.get("email") || ""), String(data.get("password") || ""));
      notice("success", "Successfully logged in.");
      window.location.href = getDashboardPath(user.role);
    } catch (error) {
      notice("error", normalizeAuthError(error, "Login failed. Please try again."));
    }
  });

  document.getElementById("popupRegisterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirmPassword") || "");
    const phone = String(data.get("phone") || "").replace(/\D/g, "");

    if (!isValidPhone(phone)) {
      notice("error", "Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 8) {
      notice("error", "Password must have at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      notice("error", "Passwords do not match.");
      return;
    }

    try {
      await register(
        String(data.get("name") || ""),
        String(data.get("email") || ""),
        phone,
        password,
        ""
      );
      const user = await login(String(data.get("email") || ""), password);
      notice("success", "Successfully registered and logged in.");
      window.location.href = getDashboardPath(user.role);
    } catch (error) {
      notice("error", normalizeAuthError(error, "Registration failed. Please try again."));
    }
  });

  document.getElementById("popupForgotEmailForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const email = String(data.get("email") || "").trim().toLowerCase();

    try {
      const check = await authAPI.checkEmail(email);
      const exists = Boolean(check?.exists);
      if (!exists) {
        notice("error", "This email is not registered.");
        return;
      }
      forgotEmail = email;
      notice("success", "Email verified. Create new password.");
      document.getElementById("popupResetPasswordForm")?.classList.remove("hidden");
    } catch (error) {
      notice("error", normalizeAuthError(error, "Could not verify email. Please try again."));
    }
  });

  document.getElementById("popupResetPasswordForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!forgotEmail) {
      notice("error", "Please verify your email first.");
      return;
    }
    const data = new FormData(event.target);
    const password = String(data.get("newPassword") || "");
    const confirm = String(data.get("confirmPassword") || "");

    if (password.length < 8) {
      notice("error", "Password must have at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      notice("error", "Passwords do not match.");
      return;
    }

    try {
      await authAPI.resetPassword(forgotEmail, password);
      notice("success", "Password updated successfully.");
      document.getElementById("popupResetPasswordForm")?.reset();
    } catch (error) {
      notice("error", normalizeAuthError(error, "Password reset failed. Please try again."));
    }
  });
}

function initAiChatbot() {
  initSmartChatbot();
}

function animateBlocks() {
  const blocks = document.querySelectorAll(".card, .hero-card, .kpi, .stat");
  blocks.forEach((block, index) => {
    block.classList.add("enter-item");
    block.style.animationDelay = `${Math.min(index * 50, 500)}ms`;
  });
}

function bindTrackPickupCta() {
  document.querySelectorAll("[data-track-pickup]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (getActiveSessionUser()) {
        return;
      }
      event.preventDefault();
      openAuthPopup();
    });
  });
}

async function renderHomeMetrics() {
  if (currentPage() !== "index.html") {
    return;
  }
  const completed = document.getElementById("homeCompletedCount");
  if (!completed) {
    return;
  }
  const session = getActiveSessionUser();
  if (!session) {
    completed.textContent = "0";
    return;
  }

  try {
    const pickupData = await pickupAPI.getAll({ limit: 300 });
    const completedCount = (pickupData.pickups || []).filter((item) => item.status === "Completed").length;
    completed.textContent = String(completedCount);
  } catch {
    completed.textContent = "0";
  }
}

function renderNotifications() {
  const session = getActiveSessionUser();
  const wrapper = document.getElementById("notifications");
  if (!wrapper) {
    return;
  }

  if (!session) {
    wrapper.innerHTML = "";
    return;
  }

  wrapper.innerHTML = `
    <div class="card">
      <h3>Recent Notifications</h3>
      <p>No alerts yet.</p>
    </div>
  `;
}

export function requireRole(roles) {
  const session = getActiveSessionUser();
  if (!session || !roles.includes(session.role)) {
    window.location.href = "auth.html";
    return null;
  }
  return session;
}

window.addEventListener("DOMContentLoaded", async () => {
  applyApiBaseFromUrl();
  setActiveNavLink();
  bindMobileNav();
  bindAuthButtons();
  renderNotifications();
  applyFeatureLock();
  initAiChatbot();
  animateBlocks();
  await renderHomeMetrics();
  bindTrackPickupCta();

  window.addEventListener("storage", async () => {
    renderNotifications();
    applyFeatureLock();
    await renderHomeMetrics();
  });
});
