import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import net from "net";
import bcrypt from "bcryptjs";
import { getDatabaseMode, getMissingSupabaseConfig } from "./config/supabase.js";
import { connectDB, isMongoConnected } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import Test from "./models/Test.js";
import { ApiUser } from "./models/api/ApiUser.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

function canBindPort(port, host = "0.0.0.0") {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once("error", () => {
      resolve(false);
    });

    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });

    tester.listen(port, host);
  });
}

async function findOpenPort(startPort, attempts = 20) {
  let candidate = Number(startPort) || 5000;

  for (let index = 0; index < attempts; index += 1) {
    const available = await canBindPort(candidate);
    if (available) {
      return candidate;
    }
    candidate += 1;
  }

  return Number(startPort) || 5000;
}

function parseAllowedOrigins() {
  return String(process.env.CLIENT_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isAllowedLocalOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isAllowedVercelOrigin(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

const allowedOrigins = [CLIENT_URL, ...parseAllowedOrigins()].filter(Boolean);

app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients and file:// pages (Origin: null).
      if (!origin || origin === "null") {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin) || isAllowedLocalOrigin(origin) || isAllowedVercelOrigin(origin)) {
        callback(null, true);
        return;
      }

      // Silently reject CORS errors instead of sending callback error
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

await connectDB();

if (isMongoConnected()) {
  try {
    const existingSample = await Test.findOne({ name: "Sample Dress" }).lean();
    if (!existingSample) {
      await Test.create({ name: "Sample Dress" });
    }
  } catch (error) {
    console.warn(`Sample seed skipped: ${error.message}`);
  }

  try {
    const demoUsers = [
      {
        id: "usr-demo-admin",
        name: "Demo Admin",
        email: "admin@.com",
        phone: "9000000001",
        address: "Head Office",
        role: "admin",
        employeeId: "ADM-0001",
        password: "Admin@123"
      },
      {
        id: "usr-demo-collector",
        name: "Demo Collector",
        email: "demo.collector@wds.local",
        phone: "9000000002",
        address: "Collector Zone 1",
        role: "collector",
        employeeId: "COL-0001",
        password: "Collector@123"
      },
      {
        id: "usr-demo-user",
        name: "Demo User",
        email: "demo.user@wds.local",
        phone: "9000000003",
        address: "User Area 1",
        role: "user",
        employeeId: "",
        password: "User@123"
      }
    ];

    for (const demoUser of demoUsers) {
      const passwordHash = await bcrypt.hash(demoUser.password, 10);
      await ApiUser.findOneAndUpdate(
        { id: demoUser.id },
        {
          $set: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            phone: demoUser.phone,
            address: demoUser.address,
            role: demoUser.role,
            employeeId: demoUser.employeeId,
            profileImage: "",
            passwordHash,
            isActive: true
          },
          $setOnInsert: {
            createdAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.warn(`Demo auth seed skipped: ${error.message}`);
  }
}

app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const dbMode = mongoConnected ? "mongo" : getDatabaseMode();

  res.json({
    status: "ok",
    service: "waste-disposal-system-api",
    database: dbMode,
    mongo: {
      connected: mongoConnected,
      host: mongoose.connection.host || "",
      name: mongoose.connection.name || ""
    },
    missingSupabaseEnv: mongoConnected ? [] : getMissingSupabaseConfig()
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const activePort = await findOpenPort(PORT);

app.listen(activePort, "0.0.0.0", () => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const dbMode = mongoConnected ? "mongo" : getDatabaseMode();
  if (activePort !== PORT) {
    console.warn(`Port ${PORT} is in use. Started on ${activePort} instead.`);
  }
  console.log(`Server running on port ${activePort}`);
  console.log(`API Base: http://localhost:${activePort}/api`);
  console.log(`Health: http://localhost:${activePort}/health`);
  console.log(`Database mode: ${dbMode}`);
  if (mongoConnected) {
    console.log(`MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  }
});