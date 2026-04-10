import { getActiveSessionUser, getSessionUser, logout } from "./services/auth.js";
import { pickupAPI, userAPI } from "./services/api.js";

let collectorPickups = [];

function showNotice(type, message) {
  const node = document.getElementById("collectorNotice");
  if (!node) return;
  node.className = `notice ${type === "error" ? "notice-error" : "notice-success"}`;
  node.textContent = message;
  node.classList.remove("hidden");
}

function showProfileNotice(type, message) {
  const node = document.getElementById("collectorProfileNotice");
  if (!node) return;
  node.className = `notice ${type === "error" ? "notice-error" : "notice-success"}`;
  node.textContent = message;
  node.classList.remove("hidden");
}

function bindProfilePreview() {
  const imageInput = document.getElementById("collectorProfileImage");
  const removeBtn = document.getElementById("collectorRemoveProfileImageBtn");
  const preview = document.getElementById("collectorProfilePreview");

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file || !preview) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = String(reader.result || "");
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener("click", () => {
    if (imageInput) {
      imageInput.value = "";
    }
    if (preview) {
      preview.src = "";
      preview.classList.add("hidden");
    }
  });
}

function showPasswordNotice(type, message) {
  const node = document.getElementById("collectorPasswordNotice");
  if (!node) return;
  node.className = `notice ${type === "error" ? "notice-error" : "notice-success"}`;
  node.textContent = message;
  node.classList.remove("hidden");
}

function setupSections() {
  const buttons = document.querySelectorAll("#collectorSubnav .subnav-btn");
  const sectionIds = [
    "collectorRoutesSection",
    "collectorTrackingSection",
    "collectorNotificationsSection",
    "collectorProfileSection"
  ];

  const activate = (id) => {
    sectionIds.forEach((sectionId) => {
      document.getElementById(sectionId)?.classList.toggle("hidden", sectionId !== id);
    });
    buttons.forEach((btn) => btn.classList.toggle("active", btn.getAttribute("data-section") === id));
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activate(String(btn.getAttribute("data-section") || "collectorRoutesSection")));
  });

  const requestedSection = String(new URLSearchParams(window.location.search).get("section") || "").trim();
  activate(sectionIds.includes(requestedSection) ? requestedSection : "collectorRoutesSection");
}

async function loadCollectorPickups() {
  const response = await pickupAPI.getAll({ limit: 200 });
  collectorPickups = response.pickups || [];
  renderRoutes();
  renderTrackingRows();
}

function renderRoutes() {
  const tbody = document.getElementById("collectorRouteRows");
  if (!tbody) return;

  if (!collectorPickups.length) {
    tbody.innerHTML = '<tr><td colspan="5">No assigned routes yet.</td></tr>';
    return;
  }

  tbody.innerHTML = collectorPickups
    .map(
      (request) => `
      <tr>
        <td>${request.id}</td>
        <td>${request.wasteType}</td>
        <td>${new Date(request.preferredDate || request.createdAt).toLocaleString()}</td>
        <td>${request.address}</td>
        <td><span class="status-pill status-${String(request.status).toLowerCase().replace(/\s+/g, "-")}">${request.status}</span></td>
      </tr>
    `
    )
    .join("");
}

function renderTrackingRows() {
  const tbody = document.getElementById("collectorRows");
  if (!tbody) return;

  if (!collectorPickups.length) {
    tbody.innerHTML = '<tr><td colspan="8">No assigned tasks yet.</td></tr>';
    return;
  }

  tbody.innerHTML = collectorPickups
    .map(
      (request) => `
      <tr>
        <td>${request.id}</td>
        <td>${request.wasteType}</td>
        <td>${new Date(request.preferredDate || request.createdAt).toLocaleString()}</td>
        <td>${request.address}</td>
        <td><span class="status-pill status-${String(request.status).toLowerCase().replace(/\s+/g, "-")}">${request.status}</span></td>
        <td>
          <select data-status-id="${request.id}">
            <option value="Pending" ${request.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Assigned" ${request.status === "Assigned" ? "selected" : ""}>Assigned</option>
            <option value="In-Progress" ${request.status === "In-Progress" ? "selected" : ""}>In-Progress</option>
            <option value="Completed" ${request.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
        <td><input type="file" accept="image/*" /></td>
        <td>
          <button class="btn btn-primary" type="button" data-save-id="${request.id}">Save</button>
          ${request.status === "Assigned" ? `<button class="btn btn-outline" type="button" data-reject-id="${request.id}" style="margin-left: 8px;">Reject</button>` : ""}
        </td>
      </tr>
    `
    )
    .join("");

  tbody.querySelectorAll("[data-save-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const requestId = String(btn.getAttribute("data-save-id") || "");
      const statusSelect = tbody.querySelector(`[data-status-id="${requestId}"]`);
      const proofInput = btn.closest("tr")?.querySelector('input[type="file"]');
      const status = statusSelect ? String(statusSelect.value || "Pending") : "Pending";

      try {
        let collectorProofImage = "";
        const proofFile = proofInput?.files?.[0];
        if (proofFile) {
          collectorProofImage = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(new Error("Failed to read proof image."));
            reader.readAsDataURL(proofFile);
          });
        }

        await pickupAPI.updateStatus(requestId, status, collectorProofImage);
        showNotice("success", `Request ${requestId} updated to ${status}.`);
        await loadCollectorPickups();
      } catch (error) {
        showNotice("error", error.message || "Failed to update request status.");
      }
    });
  });

  tbody.querySelectorAll("[data-reject-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const requestId = String(btn.getAttribute("data-reject-id") || "").trim();
      if (!requestId) {
        return;
      }

      const reasonInput = window.prompt("Reason for rejection (optional):", "");
      if (reasonInput === null) {
        return;
      }

      try {
        await pickupAPI.updateStatus(requestId, "Pending", "", {
          clearCollectorAssignment: true,
          rejectReason: String(reasonInput || "").trim()
        });
        showNotice("success", `Request ${requestId} rejected and returned for reassignment.`);
        await loadCollectorPickups();
      } catch (error) {
        showNotice("error", error.message || "Failed to reject assigned task.");
      }
    });
  });
}

async function loadProfile() {
  const session = getSessionUser();
  const response = await userAPI.getById(session.id);
  const user = response.user;

  const nameInput = document.getElementById("collectorNameInput");
  const phoneInput = document.getElementById("collectorPhoneInput");
  const emailInput = document.getElementById("collectorEmailInput");
  const preview = document.getElementById("collectorProfilePreview");

  if (nameInput) nameInput.value = user.name || "";
  if (phoneInput) phoneInput.value = user.phone || "";
  if (emailInput) emailInput.value = user.email || "";
  if (preview) {
    if (user.profileImage) {
      preview.src = user.profileImage;
      preview.classList.remove("hidden");
    } else {
      preview.src = "";
      preview.classList.add("hidden");
    }
  }
}

function bindForms() {
  const profileForm = document.getElementById("collectorProfileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const session = getSessionUser();
      const formData = new FormData(profileForm);

      let profileImage = "";
      const selectedImage = formData.get("collectorProfileImage");
      if (selectedImage instanceof File && selectedImage.size > 0) {
        profileImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Failed to read profile image."));
          reader.readAsDataURL(selectedImage);
        });
      } else {
        const currentPreview = document.getElementById("collectorProfilePreview");
        if (currentPreview?.src && !currentPreview.classList.contains("hidden")) {
          profileImage = currentPreview.src;
        }
      }

      try {
        const response = await userAPI.updateProfile(session.id, {
          name: String(formData.get("collectorNameInput") || ""),
          phone: String(formData.get("collectorPhoneInput") || ""),
          email: String(formData.get("collectorEmailInput") || ""),
          address: "",
          profileImage
        });
        localStorage.setItem("wds_session_v1", JSON.stringify(response.user));
        showProfileNotice("success", "Profile updated successfully.");
        await loadProfile();
      } catch (error) {
        showProfileNotice("error", error.message || "Failed to update profile.");
      }
    });
  }

  const passwordForm = document.getElementById("collectorPasswordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const session = getSessionUser();
      const formData = new FormData(passwordForm);
      const currentPassword = String(formData.get("collectorCurrentPassword") || "");
      const newPassword = String(formData.get("collectorNewPassword") || "");
      const confirm = String(formData.get("collectorConfirmPassword") || "");

      if (newPassword.length < 8) {
        showPasswordNotice("error", "New password must be at least 8 characters.");
        return;
      }
      if (newPassword !== confirm) {
        showPasswordNotice("error", "Passwords do not match.");
        return;
      }

      try {
        await userAPI.changePassword(session.id, currentPassword, newPassword);
        passwordForm.reset();
        showPasswordNotice("success", "Password changed successfully.");
      } catch (error) {
        showPasswordNotice("error", error.message || "Failed to change password.");
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const session = getActiveSessionUser();
  if (!session || session.role !== "collector") {
    window.location.href = "auth.html";
    return;
  }

  setupSections();
  bindProfilePreview();
  bindForms();

  try {
    await Promise.all([loadCollectorPickups(), loadProfile()]);
  } catch (error) {
    showNotice("error", error.message || "Failed to load collector dashboard.");
  }

  let refreshInProgress = false;

  setInterval(async () => {
    if (refreshInProgress) {
      return;
    }

    refreshInProgress = true;
    try {
      await loadCollectorPickups();
    } catch {
      // silent refresh
    } finally {
      refreshInProgress = false;
    }
  }, 30000);

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    logout();
    window.location.href = "auth.html";
  });
});