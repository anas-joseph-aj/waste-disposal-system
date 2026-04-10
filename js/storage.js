const DB_KEY = "wds_db_v1";
const SESSION_KEY = "wds_session_v1";
const AUTH_TOKEN_KEY = "wds_auth_token_v1";

function getApiBase() {
  const configured = window.WDS_API_BASE || localStorage.getItem("wds_api_base");
  if (!configured) {
    return "";
  }
  return String(configured).replace(/\/+$/, "");
}

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const base = getApiBase();
  if (!base) {
    const networkError = new Error("API_UNREACHABLE");
    networkError.code = "API_UNREACHABLE";
    throw networkError;
  }

  const headers = {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    const networkError = new Error("API_UNREACHABLE");
    networkError.code = "API_UNREACHABLE";
    networkError.cause = error;
    throw networkError;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const requestError = new Error(payload.message || "Request failed.");
    requestError.status = response.status;
    requestError.code = `API_HTTP_${response.status}`;
    throw requestError;
  }

  return payload;
}

function shouldFallbackToLocal(error) {
  if (!error) {
    return false;
  }

  if (error.code === "API_UNREACHABLE") {
    return true;
  }

  if (error.status === 404 || error.status >= 500) {
    return true;
  }

  if (error.status === 401 || error.status === 403) {
    return true;
  }

  // Static hosts can return non-API HTML/edge responses for /api routes.
  if (typeof error.message === "string" && error.message.trim().toLowerCase() === "request failed.") {
    return true;
  }

  return false;
}

function nowIso() {
  return new Date().toISOString();
}

function genId(prefix) {
  if (window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function normalizeEmployeeId(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function buildNextCollectorEmployeeId(users) {
  const maxNumber = users
    .filter((user) => user.role === "collector")
    .map((user) => normalizeEmployeeId(user.employeeId))
    .map((employeeId) => {
      const match = /^COL-(\d+)$/.exec(employeeId);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);

  return `COL-${String(maxNumber + 1).padStart(4, "0")}`;
}

function buildNextAdminEmployeeId(users) {
  const maxNumber = users
    .filter((user) => user.role === "admin")
    .map((user) => normalizeEmployeeId(user.employeeId))
    .map((employeeId) => {
      const match = /^ADM-(\d+)$/.exec(employeeId);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);

  return `ADM-${String(maxNumber + 1).padStart(4, "0")}`;
}

function ensureCollectorEmployeeIds(db) {
  if (!Array.isArray(db?.users)) {
    return false;
  }

  let changed = false;
  const used = new Set();

  for (const user of db.users) {
    if (user.role !== "collector") {
      continue;
    }

    const original = String(user.employeeId || "");
    const normalized = normalizeEmployeeId(user.employeeId);
    if (normalized) {
      if (!used.has(normalized)) {
        user.employeeId = normalized;
        used.add(normalized);
      } else {
        user.employeeId = "";
      }
      if (user.employeeId !== original) {
        changed = true;
      }
    }
  }

  for (const user of db.users) {
    if (user.role !== "collector") {
      continue;
    }
    if (normalizeEmployeeId(user.employeeId)) {
      continue;
    }

    let next = buildNextCollectorEmployeeId(db.users);
    while (used.has(next)) {
      next = buildNextCollectorEmployeeId([
        ...db.users,
        { role: "collector", employeeId: next }
      ]);
    }

    user.employeeId = next;
    used.add(next);
    changed = true;
  }

  return changed;
}

function ensureAdminEmployeeIds(db) {
  if (!Array.isArray(db?.users)) {
    return false;
  }

  let changed = false;
  const used = new Set(
    db.users
      .map((user) => normalizeEmployeeId(user.employeeId))
      .filter(Boolean)
  );

  for (const user of db.users) {
    if (user.role !== "admin") {
      continue;
    }

    const original = String(user.employeeId || "");
    const normalized = normalizeEmployeeId(user.employeeId);
    if (normalized) {
      user.employeeId = normalized;
      if (user.employeeId !== original) {
        changed = true;
      }
      continue;
    }

    let next = buildNextAdminEmployeeId(db.users);
    while (used.has(next)) {
      next = buildNextAdminEmployeeId([...db.users, { role: "admin", employeeId: next }]);
    }

    user.employeeId = next;
    used.add(next);
    changed = true;
  }

  return changed;
}

function readDb() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export async function hashPassword(password) {
  const buffer = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function initDatabase() {
  const existing = readDb();
  if (existing) {
    let changed = false;

    if (!existing.systemSettings) {
      existing.systemSettings = { pickupFee: 50 };
      changed = true;
    }

    if (Array.isArray(existing.users)) {
      for (const user of existing.users) {
        if (typeof user.address !== "string") {
          user.address = "";
          changed = true;
        }
        if (typeof user.profileImage !== "string") {
          user.profileImage = "";
          changed = true;
        }
      }

      // Keep demo admin credentials recoverable in local mode.
      const adminUser = existing.users.find((user) => user.role === "admin");
      if (!adminUser) {
        existing.users.push({
          id: genId("usr"),
          name: "System Admin",
          email: "admin@gmail.com",
          employeeId: "ADM-0001",
          phone: "000-000-0000",
          address: "Operations Center",
          profileImage: "",
          role: "admin",
          passwordHash: await hashPassword("Admin@123"),
          createdAt: nowIso()
        });
        changed = true;
      }
    }

    if (ensureCollectorEmployeeIds(existing)) {
      changed = true;
    }

    if (ensureAdminEmployeeIds(existing)) {
      changed = true;
    }

    if (Array.isArray(existing.pickupRequests)) {
      for (const request of existing.pickupRequests) {
        if (typeof request.status !== "string") {
          request.status = "Pending";
          changed = true;
        }
        if (request.payment === undefined) {
          request.payment = null;
          changed = true;
        }
      }
    }

    if (changed) {
      writeDb(existing);
    }

    return existing;
  }

  const adminHash = await hashPassword("Admin@123");
  const collectorHash = await hashPassword("Collector@123");
  const userHash = await hashPassword("User@123");

  const adminUser = {
    id: genId("usr"),
    name: "System Admin",
    email: "admin@gmail.com",
    employeeId: "ADM-0001",
    phone: "000-000-0000",
    address: "Operations Center",
    profileImage: "",
    role: "admin",
    passwordHash: adminHash,
    createdAt: nowIso()
  };

  const collectorUser = {
    id: genId("usr"),
    name: "Field Collector",
    email: "collector@wds.local",
    employeeId: "COL-0001",
    phone: "000-111-2222",
    address: "North Zone Depot",
    profileImage: "",
    role: "collector",
    passwordHash: collectorHash,
    createdAt: nowIso()
  };

  const standardUser = {
    id: genId("usr"),
    name: "Resident User",
    email: "user@wds.local",
    phone: "000-333-4444",
    address: "Residential Sector 1",
    profileImage: "",
    role: "user",
    passwordHash: userHash,
    createdAt: nowIso()
  };

  const db = {
    users: [adminUser, collectorUser, standardUser],
    collectors: [
      {
        id: genId("col"),
        userId: collectorUser.id,
        vehicleNo: "ECO-102",
        zone: "North Zone",
        active: true
      }
    ],
    admins: [
      {
        id: genId("adm"),
        userId: adminUser.id,
        department: "City Operations"
      }
    ],
    pickupRequests: [],
    wasteCategories: [
      { id: "cat-organic", name: "Organic" },
      { id: "cat-plastic", name: "Plastic" },
      { id: "cat-ewaste", name: "E-waste" },
      { id: "cat-hazardous", name: "Hazardous" }
    ],
    feedback: [],
    complaints: [],
    notifications: [],
    systemSettings: {
      pickupFee: 50
    }
  };

  writeDb(db);
  return db;
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getDb() {
  return readDb();
}

export async function registerUser({ name, email, phone, address = "", password, role = "user", employeeId = "" }) {
  if (role === "user") {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: { name, email, phone, address, password, role: "user" }
      });
      if (data?.user) {
        return data.user;
      }
    } catch (error) {
      const canFallback = shouldFallbackToLocal(error);
      if (!canFallback) {
        throw error;
      }
    }
  }

  const db = await initDatabase();
  const loweredEmail = email.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === loweredEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: genId("usr"),
    name: name.trim(),
    email: loweredEmail,
    phone: phone.trim(),
    address: address.trim(),
    profileImage: "",
    role,
    passwordHash: await hashPassword(password),
    createdAt: nowIso()
  };

  if (role === "collector") {
    const normalizedEmployeeId = normalizeEmployeeId(employeeId) || buildNextCollectorEmployeeId(db.users);
    const duplicateEmployeeId = db.users.find(
      (entry) => entry.role === "collector" && normalizeEmployeeId(entry.employeeId) === normalizedEmployeeId
    );
    if (duplicateEmployeeId) {
      throw new Error("Collector employee ID already exists.");
    }
    newUser.employeeId = normalizedEmployeeId;
  }

  db.users.push(newUser);

  if (role === "collector") {
    db.collectors.push({
      id: genId("col"),
      userId: newUser.id,
      vehicleNo: "TBD",
      zone: "Unassigned",
      active: true
    });
  }

  if (role === "admin") {
    db.admins.push({
      id: genId("adm"),
      userId: newUser.id,
      department: "Operations"
    });
  }

  writeDb(db);
  return newUser;
}

export async function login({ email, identifier, password }) {
  const rawIdentifier = String(identifier ?? email ?? "").trim();

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email: rawIdentifier, password }
    });

    if (data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    }

    if (data?.user) {
      const sessionUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        address: data.user.address || "",
        profileImage: data.user.profileImage || "",
        role: data.user.role,
        employeeId: data.user.employeeId || ""
      };
      setSession(sessionUser);
      return sessionUser;
    }
  } catch (error) {
    const canFallback = shouldFallbackToLocal(error);
    if (!canFallback) {
      throw error;
    }
  }

  const db = await initDatabase();
  const loweredEmail = rawIdentifier.toLowerCase();
  const normalizedEmployeeId = normalizeEmployeeId(rawIdentifier);
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === loweredEmail ||
      normalizeEmployeeId(u.employeeId) === normalizedEmployeeId
  );

  if (!user) {
    throw new Error("Invalid email/employee ID or password.");
  }

  const providedHash = await hashPassword(password);
  if (providedHash !== user.passwordHash) {
    throw new Error("Invalid email/employee ID or password.");
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || "",
    profileImage: user.profileImage || "",
    role: user.role
  };

  setSession(sessionUser);
  return sessionUser;
}

function pushNotification(db, notification) {
  db.notifications.unshift({
    id: genId("ntf"),
    createdAt: nowIso(),
    isRead: false,
    ...notification
  });
}

export function getNotificationsForUser(user) {
  const db = getDb();
  if (!db || !user) {
    return [];
  }

  return db.notifications.filter((n) => {
    if (n.userId && n.userId === user.id) {
      return true;
    }
    return n.role && n.role === user.role;
  });
}

export function markNotificationRead(notificationId) {
  const db = getDb();
  if (!db) {
    return;
  }
  const target = db.notifications.find((n) => n.id === notificationId);
  if (target) {
    target.isRead = true;
    writeDb(db);
  }
}

export function createPickupRequest({ wasteType, dateTime, address, notes, wasteImage = "", payment = null }, requester) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const record = {
    id: genId("req"),
    requesterId: requester.id,
    wasteType,
    dateTime,
    address,
    notes,
    status: "Pending",
    assignedCollectorId: null,
    wasteImage,
    payment,
    proofImage: "",
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  db.pickupRequests.unshift(record);
  pushNotification(db, {
    role: "admin",
    title: "New pickup request",
    message: `${requester.name} submitted a ${wasteType} pickup request.`
  });

  writeDb(db);
  return record;
}

export function getPickupRequestsByUser(userId) {
  const db = getDb();
  return db ? db.pickupRequests.filter((r) => r.requesterId === userId) : [];
}

export function getAssignedRequests(collectorUserId) {
  const db = getDb();
  return db
    ? db.pickupRequests.filter((r) => r.assignedCollectorId === collectorUserId)
    : [];
}

export function getAllRequests() {
  const db = getDb();
  return db ? db.pickupRequests : [];
}

export function getCollectors() {
  const db = getDb();
  if (!db) {
    return [];
  }

  return db.users.filter((u) => u.role === "collector");
}

export function getUsers() {
  const db = getDb();
  return db ? db.users : [];
}

export function getWasteCategories() {
  const db = getDb();
  return db ? db.wasteCategories : [];
}

export function getPickupFee() {
  const db = getDb();
  return db?.systemSettings?.pickupFee ?? 50;
}

export function updatePickupFee(amount) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Pickup fee must be a valid amount.");
  }

  if (!db.systemSettings) {
    db.systemSettings = { pickupFee: 50 };
  }

  db.systemSettings.pickupFee = Math.round(numericAmount);
  writeDb(db);
  return db.systemSettings.pickupFee;
}

export function assignCollector(requestId, collectorUserId, adminUser) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const request = db.pickupRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("Request not found.");
  }

  const collector = db.users.find((u) => u.id === collectorUserId && u.role === "collector");
  if (!collector) {
    throw new Error("Collector not found.");
  }

  request.assignedCollectorId = collectorUserId;
  request.updatedAt = nowIso();

  pushNotification(db, {
    userId: request.requesterId,
    title: "Collector assigned",
    message: `${collector.name} is assigned by ${adminUser.name} for your pickup.`
  });

  pushNotification(db, {
    userId: collectorUserId,
    title: "Next assigned route",
    message: `Request ${request.id}: ${request.address} at ${new Date(request.dateTime).toLocaleString()}.`
  });

  writeDb(db);
  return request;
}

export function approvePayment(requestId, adminUser) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const request = db.pickupRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("Request not found.");
  }

  if (!request.payment) {
    throw new Error("Payment data not found for this request.");
  }

  request.payment.status = "Approved";
  request.payment.approvedAt = nowIso();
  request.payment.approvedBy = adminUser.id;
  request.updatedAt = nowIso();

  pushNotification(db, {
    userId: request.requesterId,
    title: "Payment approved",
    message: `Your payment for request ${request.id} was approved by admin.`
  });

  writeDb(db);
  return request;
}

export function adminUpdateRequestStatus(requestId, newStatus, adminUser) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const request = db.pickupRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("Request not found.");
  }

  const allowed = ["Pending", "Checking", "Assigning", "Completed"];
  if (!allowed.includes(newStatus)) {
    throw new Error("Invalid status selected.");
  }

  if (request.payment?.status !== "Approved" && newStatus !== "Pending") {
    throw new Error("Payment must be approved before moving beyond Pending.");
  }

  const order = {
    Pending: 1,
    Checking: 2,
    Assigning: 3,
    Completed: 4
  };

  const currentRank = order[request.status] || 1;
  const targetRank = order[newStatus];
  if (targetRank > currentRank + 1) {
    throw new Error("Update status step-by-step without skipping.");
  }

  request.status = newStatus;
  request.updatedAt = nowIso();

  pushNotification(db, {
    userId: request.requesterId,
    title: `Request status: ${newStatus}`,
    message: `${adminUser.name} updated request ${request.id} to ${newStatus}.`
  });

  writeDb(db);
  return request;
}

export function updateRequestStatus(requestId, status, collectorUserId, proofImage = "") {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const request = db.pickupRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.assignedCollectorId !== collectorUserId) {
    throw new Error("You are not assigned to this request.");
  }

  request.status = status;
  request.updatedAt = nowIso();
  if (proofImage) {
    request.proofImage = proofImage;
  }

  pushNotification(db, {
    userId: request.requesterId,
    title: `Status changed to ${status}`,
    message: `Your pickup ${request.id} is now ${status}.`
  });

  pushNotification(db, {
    role: "admin",
    title: `Request ${status}`,
    message: `Collector updated ${request.id} to ${status}.`
  });

  writeDb(db);
  return request;
}

export function addFeedback({ requestId, rating, comment }, user) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  db.feedback.unshift({
    id: genId("fb"),
    requestId,
    userId: user.id,
    rating,
    comment,
    createdAt: nowIso()
  });

  writeDb(db);
}

export function addComplaint({ subject, message }, user) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  db.complaints.unshift({
    id: genId("cmp"),
    userId: user.id,
    subject,
    message,
    status: "Open",
    createdAt: nowIso()
  });

  pushNotification(db, {
    role: "admin",
    title: "New complaint",
    message: `${user.name} submitted a complaint: ${subject}`
  });

  writeDb(db);
}

export function getAnalytics() {
  const db = getDb();
  if (!db) {
    return {
      totalRequests: 0,
      pending: 0,
      checking: 0,
      assigning: 0,
      completed: 0,
      byWasteType: {}
    };
  }

  const totals = {
    totalRequests: db.pickupRequests.length,
    pending: 0,
    checking: 0,
    assigning: 0,
    completed: 0,
    byWasteType: {}
  };

  for (const request of db.pickupRequests) {
    if (request.status === "Pending") {
      totals.pending += 1;
    }
    if (request.status === "Checking") {
      totals.checking += 1;
    }
    if (request.status === "Assigning") {
      totals.assigning += 1;
    }
    if (request.status === "Completed") {
      totals.completed += 1;
    }

    totals.byWasteType[request.wasteType] = (totals.byWasteType[request.wasteType] || 0) + 1;
  }

  return totals;
}

export function getFeedback() {
  const db = getDb();
  return db ? db.feedback : [];
}

export function getComplaints() {
  const db = getDb();
  return db ? db.complaints : [];
}

export function getComplaintsByUser(userId) {
  const db = getDb();
  return db ? db.complaints.filter((entry) => entry.userId === userId) : [];
}

export function getPaymentHistoryByUser(userId) {
  const db = getDb();
  if (!db) {
    return [];
  }

  return db.pickupRequests.filter((entry) => entry.requesterId === userId && entry.payment);
}

export function getUserById(userId) {
  const db = getDb();
  if (!db) {
    return null;
  }

  return db.users.find((entry) => entry.id === userId) || null;
}

export function updateUserProfile(userId, { name, email, phone, address, profileImage, removeProfileImage = false }) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const user = db.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const loweredEmail = String(email || "").trim().toLowerCase();
  if (!loweredEmail) {
    throw new Error("Email is required.");
  }

  const duplicate = db.users.find((entry) => entry.id !== userId && entry.email.toLowerCase() === loweredEmail);
  if (duplicate) {
    throw new Error("Email is already in use by another account.");
  }

  user.name = String(name || "").trim();
  user.email = loweredEmail;
  user.phone = String(phone || "").trim();
  user.address = String(address || "").trim();
  if (removeProfileImage) {
    user.profileImage = "";
  } else if (typeof profileImage === "string" && profileImage) {
    user.profileImage = profileImage;
  }

  writeDb(db);

  const updatedSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    profileImage: user.profileImage || "",
    role: user.role
  };
  setSession(updatedSession);

  return user;
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const user = db.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== user.passwordHash) {
    throw new Error("Current password is incorrect.");
  }

  user.passwordHash = await hashPassword(newPassword);
  writeDb(db);
}

export async function resetPasswordByEmail(email, newPassword) {
  try {
    await apiRequest("/auth/reset-password", {
      method: "POST",
      body: { email, newPassword }
    });
    return;
  } catch (error) {
    const canFallback = shouldFallbackToLocal(error);
    if (!canFallback) {
      throw error;
    }
  }

  const db = await initDatabase();
  const loweredEmail = email.trim().toLowerCase();
  const user = db.users.find((entry) => entry.email.toLowerCase() === loweredEmail);

  if (!user) {
    throw new Error("This email is not registered.");
  }

  user.passwordHash = await hashPassword(newPassword);
  writeDb(db);
  return user;
}

export async function checkEmailExists(email) {
  try {
    const data = await apiRequest("/auth/check-email", {
      method: "POST",
      body: { email }
    });
    if (typeof data?.exists === "boolean") {
      return data.exists;
    }
  } catch (error) {
    const canFallback = shouldFallbackToLocal(error);
    if (!canFallback) {
      throw error;
    }
  }

  const db = await initDatabase();
  const loweredEmail = email.trim().toLowerCase();
  return db.users.some((entry) => entry.email.toLowerCase() === loweredEmail);
}

export async function adminCreateAccount({ name, email, phone, address = "", role, password }) {
  if (!["user", "collector"].includes(role)) {
    throw new Error("Admin can only create user or collector accounts.");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must have at least 8 characters.");
  }

  return registerUser({
    name,
    email,
    phone,
    address,
    role,
    password,
    employeeId: role === "collector" ? buildNextCollectorEmployeeId((await initDatabase()).users) : ""
  });
}

export function adminRemoveAccount(userId, role) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized.");
  }

  const userIndex = db.users.findIndex((entry) => entry.id === userId && entry.role === role);
  if (userIndex < 0) {
    throw new Error("Account not found.");
  }

  if (role === "admin") {
    throw new Error("Admin accounts cannot be removed here.");
  }

  db.users.splice(userIndex, 1);

  if (role === "collector") {
    db.collectors = db.collectors.filter((entry) => entry.userId !== userId);
    for (const request of db.pickupRequests) {
      if (request.assignedCollectorId === userId) {
        request.assignedCollectorId = null;
      }
    }
  }

  writeDb(db);
}

export function getRevenueAnalytics() {
  const db = getDb();
  const summary = {
    approvedRevenue: 0,
    pendingRevenue: 0,
    byMethod: {
      "UPI Payment": 0,
      "Bank Payment": 0,
      "Card Payment": 0
    },
    transactions: []
  };

  if (!db) {
    return summary;
  }

  for (const request of db.pickupRequests) {
    if (!request.payment) {
      continue;
    }

    const amount = Number(request.payment.amount) || 0;
    const method = request.payment.method || "Unknown";

    if (request.payment.status === "Approved") {
      summary.approvedRevenue += amount;
    } else {
      summary.pendingRevenue += amount;
    }

    if (summary.byMethod[method] === undefined) {
      summary.byMethod[method] = 0;
    }
    summary.byMethod[method] += amount;

    summary.transactions.push({
      requestId: request.id,
      method,
      amount,
      status: request.payment.status,
      reference: request.payment.reference || "",
      paidAt: request.payment.paidAt || ""
    });
  }

  return summary;
}
