import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { isMongoConnected } from "../config/mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../../data/db.json");
const PRIMARY_STATE_KEY = "primary";

const appStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const AppState = mongoose.models.AppState || mongoose.model("AppState", appStateSchema);

let dbCache = null;

function nowIso() {
  return new Date().toISOString();
}

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function normalizeEmployeeId(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function nextCollectorEmployeeId(users) {
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

function nextAdminEmployeeId(users) {
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
    if (normalized && !used.has(normalized)) {
      user.employeeId = normalized;
      used.add(normalized);
    } else {
      user.employeeId = "";
    }

    if (user.employeeId !== original) {
      changed = true;
    }
  }

  for (const user of db.users) {
    if (user.role !== "collector") {
      continue;
    }
    if (normalizeEmployeeId(user.employeeId)) {
      continue;
    }

    let employeeId = nextCollectorEmployeeId(db.users);
    while (used.has(employeeId)) {
      employeeId = nextCollectorEmployeeId([...db.users, { role: "collector", employeeId }]);
    }
    user.employeeId = employeeId;
    used.add(employeeId);
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

    let employeeId = nextAdminEmployeeId(db.users);
    while (used.has(employeeId)) {
      employeeId = nextAdminEmployeeId([...db.users, { role: "admin", employeeId }]);
    }

    user.employeeId = employeeId;
    used.add(employeeId);
    changed = true;
  }

  return changed;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    employeeId: user.role === "collector" ? user.employeeId || "" : undefined,
    address: user.address || "",
    profileImage: user.profileImage || "",
    role: user.role,
    createdAt: user.createdAt
  };
}

async function readDbFile() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    if (!raw.trim()) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch (parseError) {
      // Preserve the invalid file for debugging, then continue with a fresh in-memory seed.
      const backupPath = `${DB_PATH}.corrupt-${Date.now()}.bak`;
      try {
        await fs.writeFile(backupPath, raw, "utf8");
        console.warn(`Invalid JSON in ${DB_PATH}. Backed up to ${backupPath} and reinitializing store.`);
      } catch {
        console.warn(`Invalid JSON in ${DB_PATH}. Could not create backup file; reinitializing store.`);
      }
      return {};
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeDbFile(db) {
  await fs.writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

async function readMongoState() {
  const state = await AppState.findOne({ key: PRIMARY_STATE_KEY }).lean();
  if (!state?.payload || typeof state.payload !== "object") {
    return {};
  }
  return state.payload;
}

async function writeMongoState(db) {
  await AppState.updateOne(
    { key: PRIMARY_STATE_KEY },
    { $set: { payload: db, updatedAt: new Date() } },
    { upsert: true }
  );
}

async function makeSeedDatabase() {
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const collectorHash = await bcrypt.hash("Collector@123", 10);
  const userHash = await bcrypt.hash("User@123", 10);

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

  return {
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
}

export async function initStore() {
  if (dbCache) {
    return dbCache;
  }

  const useMongo = isMongoConnected();
  let raw = useMongo ? await readMongoState() : await readDbFile();

  if (useMongo && (!Array.isArray(raw.users) || raw.users.length === 0)) {
    const fileFallback = await readDbFile();
    if (Array.isArray(fileFallback.users) && fileFallback.users.length > 0) {
      raw = fileFallback;
    }
  }

  const hasUsers = Array.isArray(raw.users) && raw.users.length > 0;
  dbCache = hasUsers ? raw : await makeSeedDatabase();

  const collectorIdsChanged = ensureCollectorEmployeeIds(dbCache);
  const adminIdsChanged = ensureAdminEmployeeIds(dbCache);

  if (collectorIdsChanged || adminIdsChanged || !hasUsers) {
    if (useMongo) {
      await writeMongoState(dbCache);
    } else {
      await writeDbFile(dbCache);
    }
  }

  return dbCache;
}

export async function getDb() {
  if (!dbCache) {
    await initStore();
  }
  return dbCache;
}

export async function getSystemSettings() {
  const db = await getDb();
  return db.systemSettings || { pickupFee: 50 };
}

export async function updateSystemSettings(settings = {}) {
  const db = await getDb();
  db.systemSettings = {
    ...db.systemSettings,
    ...settings
  };
  await saveDb();
  return db.systemSettings;
}

export async function saveDb() {
  if (!dbCache) {
    await initStore();
  }

  if (isMongoConnected()) {
    await writeMongoState(dbCache);
    return;
  }

  await writeDbFile(dbCache);
}

export function getNowIso() {
  return nowIso();
}

export function getId(prefix) {
  return genId(prefix);
}

export function toSafeUser(user) {
  return sanitizeUser(user);
}
