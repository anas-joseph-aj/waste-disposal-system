import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireMongoAuth, requireMongoRole } from "../../middleware/authMongo.js";
import { User } from "../../models/User.js";
import { Complaint } from "../../models/Complaint.js";
import { Collector } from "../../models/Collector.js";
import { ChatLog } from "../../models/ChatLog.js";
import { detectIntent, extractLocation, extractTicketId } from "../../services/intent.js";
import { getText } from "../../services/i18n.js";
import { getAiCompletion } from "../../services/openai.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage
  };
}

function normalizeEmployeeId(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

async function nextTicketId() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateChunk = `${yyyy}${mm}${dd}`;
  const count = await Complaint.countDocuments({
    createdAt: {
      $gte: new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`),
      $lt: new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`)
    }
  });

  return `CMP-${dateChunk}-${String(count + 1).padStart(4, "0")}`;
}

function routeHintForLocation(location) {
  const points = ["Depot", "Main Road", "Ward Gate", "Pickup Point", "Transfer Station"];
  return `${points.join(" -> ")} -> ${location}`;
}

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "wds-ai-chatbot-v2" });
});

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "user", preferredLanguage = "en" } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (!["user", "collector", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const loweredEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: loweredEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: loweredEmail,
      passwordHash: await bcrypt.hash(String(password), 10),
      role,
      preferredLanguage
    });

    if (role === "collector") {
      await Collector.create({ userId: user._id, vehicleId: "AUTO-001", zone: "City" });
    }

    const token = signToken(user);
    return res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user." });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email/employee ID and password are required." });
    }

    const identifier = String(email).trim();
    const loweredEmail = identifier.toLowerCase();
    const normalizedEmployeeId = normalizeEmployeeId(identifier);
    const user = await User.findOne({
      $or: [{ email: loweredEmail }, { employeeId: normalizedEmployeeId }]
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email/employee ID or password." });
    }

    const match = await bcrypt.compare(String(password), user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email/employee ID or password." });
    }

    const token = signToken(user);
    return res.json({ token, user: safeUser(user) });
  } catch {
    return res.status(500).json({ message: "Failed to login." });
  }
});

router.post("/complaints", requireMongoAuth, async (req, res) => {
  const { location, description, imageUrl = "" } = req.body || {};
  if (!location || !description) {
    return res.status(400).json({ message: "location and description are required." });
  }

  const user = await User.findById(req.auth.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const ticketId = await nextTicketId();
  const complaint = await Complaint.create({
    ticketId,
    userId: user._id,
    reportedByName: user.name,
    location: String(location).trim(),
    description: String(description).trim(),
    imageUrl,
    routeHint: routeHintForLocation(String(location).trim()),
    status: "Pending",
    lastUpdateByRole: user.role
  });

  return res.status(201).json({ complaint });
});

router.patch("/complaints/:id/status", requireMongoAuth, requireMongoRole("collector", "admin"), async (req, res) => {
  const { status } = req.body || {};
  if (!["Pending", "InProgress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  complaint.status = status;
  complaint.lastUpdateByRole = req.auth.role;
  await complaint.save();

  return res.json({ complaint });
});

router.get("/complaints/me", requireMongoAuth, async (req, res) => {
  const complaints = await Complaint.find({ userId: req.auth.userId }).sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.get("/complaints/:id", requireMongoAuth, async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  const allowed =
    req.auth.role === "admin" ||
    complaint.userId?.toString() === req.auth.userId ||
    complaint.assignedCollectorId?.toString() === req.auth.userId;

  if (!allowed) {
    return res.status(403).json({ message: "Forbidden." });
  }

  return res.json({ complaint });
});

router.get("/collector/tasks", requireMongoAuth, requireMongoRole("collector"), async (req, res) => {
  const tasks = await Complaint.find({ assignedCollectorId: req.auth.userId }).sort({ createdAt: -1 });
  return res.json({
    tasks: tasks.map((task) => ({
      ...task.toObject(),
      routeSimulation: task.routeHint || routeHintForLocation(task.location)
    }))
  });
});

router.post("/collector/tasks/:id/update", requireMongoAuth, requireMongoRole("collector"), async (req, res) => {
  const { status } = req.body || {};
  if (!["Pending", "InProgress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const task = await Complaint.findOne({ _id: req.params.id, assignedCollectorId: req.auth.userId });
  if (!task) {
    return res.status(404).json({ message: "Assigned task not found." });
  }

  task.status = status;
  task.lastUpdateByRole = "collector";
  await task.save();

  return res.json({ complaint: task });
});

router.get("/admin/complaints", requireMongoAuth, requireMongoRole("admin"), async (req, res) => {
  const complaints = await Complaint.find({}).sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.post("/admin/complaints/:id/assign", requireMongoAuth, requireMongoRole("admin"), async (req, res) => {
  const { collectorId } = req.body || {};
  if (!collectorId) {
    return res.status(400).json({ message: "collectorId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    return res.status(400).json({ message: "collectorId must be a valid MongoDB ObjectId." });
  }

  const collector = await User.findOne({ _id: collectorId, role: "collector" });
  if (!collector) {
    return res.status(404).json({ message: "Collector not found." });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  complaint.assignedCollectorId = collector._id;
  complaint.status = complaint.status === "Pending" ? "InProgress" : complaint.status;
  complaint.lastUpdateByRole = "admin";
  await complaint.save();

  await Collector.findOneAndUpdate(
    { userId: collector._id },
    { $addToSet: { assignedTasks: complaint._id } },
    { upsert: true }
  );

  return res.json({ complaint });
});

router.get("/admin/insights", requireMongoAuth, requireMongoRole("admin"), async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [todayCount, pendingCount, completedCount] = await Promise.all([
    Complaint.countDocuments({ createdAt: { $gte: start } }),
    Complaint.countDocuments({ status: { $in: ["Pending", "InProgress"] } }),
    Complaint.countDocuments({ status: "Completed" })
  ]);

  const missedPickups = await Complaint.countDocuments({
    status: { $in: ["Pending", "InProgress"] },
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  return res.json({
    insights: {
      totalComplaintsToday: todayCount,
      pendingVsCompleted: { pending: pendingCount, completed: completedCount },
      missedPickups
    }
  });
});

router.post("/admin/alerts/missed", requireMongoAuth, requireMongoRole("admin"), async (req, res) => {
  const staleComplaints = await Complaint.find({
    status: { $in: ["Pending", "InProgress"] },
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  })
    .sort({ createdAt: 1 })
    .limit(20);

  const message = staleComplaints.length
    ? `Alert sent for ${staleComplaints.length} missed pickup(s).`
    : "No missed pickups found.";

  await ChatLog.create({
    role: "system",
    language: "en",
    message,
    meta: {
      type: "missed-pickup-alert",
      complaintIds: staleComplaints.map((item) => item._id.toString())
    }
  });

  return res.json({ message, count: staleComplaints.length });
});

router.get("/chat/history", requireMongoAuth, async (req, res) => {
  const logs = await ChatLog.find({ userId: req.auth.userId }).sort({ createdAt: 1 }).limit(100);
  return res.json({ logs });
});

router.post("/chatbot/message", async (req, res) => {
  const { message = "", language = "en", imageUrl = "" } = req.body || {};
  const text = String(message || "").trim();
  if (!text && !imageUrl) {
    return res.status(400).json({ message: "message or imageUrl is required." });
  }

  let authUserId = null;
  if (req.headers.authorization) {
    try {
      const [, token] = String(req.headers.authorization).split(" ");
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
      authUserId = payload.userId || null;
    } catch {
      authUserId = null;
    }
  }

  const selectedLanguage = ["en", "hi", "kn"].includes(language) ? language : "en";
  const t = getText(selectedLanguage);

  const intent = detectIntent(text);
  const user = authUserId ? await User.findById(authUserId) : null;

  if (user) {
    await ChatLog.create({
      userId: user._id,
      role: "user",
      language: selectedLanguage,
      message: text || "[image upload]",
      meta: { imageProvided: Boolean(imageUrl) }
    });
  }

  let reply = t.greet;
  let complaintCreated = null;

  if (user?.chatbotState?.mode === "complaint" && user.chatbotState.step === "awaiting_location") {
    const location = extractLocation(text) || text;
    user.chatbotState.step = "awaiting_image";
    user.chatbotState.draftComplaint.location = location;
    await user.save();
    reply = t.askImage;
  } else if (user?.chatbotState?.mode === "complaint" && user.chatbotState.step === "awaiting_image") {
    const skipRequested = /skip|no image|later/i.test(text);
    if (!skipRequested && !imageUrl) {
      reply = t.askImage;
    } else {
      if (!skipRequested) {
        user.chatbotState.draftComplaint.imageUrl = imageUrl;
      }

      const draft = user.chatbotState.draftComplaint;
      const ticketId = await nextTicketId();
      complaintCreated = await Complaint.create({
        ticketId,
        userId: user._id,
        reportedByName: user.name,
        location: draft.location,
        description: draft.description || "Garbage not collected",
        imageUrl: draft.imageUrl || "",
        routeHint: routeHintForLocation(draft.location),
        status: "Pending",
        lastUpdateByRole: "user"
      });

      user.chatbotState = {
        mode: "",
        step: "",
        draftComplaint: { description: "", location: "", imageUrl: "" }
      };
      await user.save();

      reply = t.ticketCreated(ticketId);
    }
  } else if (intent === "complaint") {
    if (!user) {
      const location = extractLocation(text);
      if (!location) {
        reply = `${t.askLocation} You can login for personalized tracking.`;
      } else {
        const ticketId = await nextTicketId();
        complaintCreated = await Complaint.create({
          ticketId,
          userId: null,
          reportedByName: "Guest",
          location,
          description: text,
          imageUrl,
          routeHint: routeHintForLocation(location),
          status: "Pending",
          lastUpdateByRole: "user"
        });
        reply = t.ticketCreated(ticketId);
      }
    } else {
      const location = extractLocation(text);
      if (location) {
        const ticketId = await nextTicketId();
        complaintCreated = await Complaint.create({
          ticketId,
          userId: user._id,
          reportedByName: user.name,
          location,
          description: text,
          imageUrl,
          routeHint: routeHintForLocation(location),
          status: "Pending",
          lastUpdateByRole: "user"
        });
        reply = t.ticketCreated(ticketId);
      } else {
        user.chatbotState = {
          mode: "complaint",
          step: "awaiting_location",
          draftComplaint: { description: text, location: "", imageUrl: "" }
        };
        await user.save();
        reply = t.askLocation;
      }
    }
  } else if (intent === "track") {
    const ticketId = extractTicketId(text);
    if (!ticketId) {
      reply = t.trackNeedTicket;
    } else {
      const complaint = await Complaint.findOne({ ticketId });
      if (!complaint) {
        reply = t.noTicketFound;
      } else {
        reply = `Ticket ${complaint.ticketId} is ${complaint.status}. Location: ${complaint.location}.`;
      }
    }
  } else if (intent === "schedule") {
    reply = t.schedule;
  } else if (intent === "segregation") {
    reply = t.segregation;
  } else if (intent === "help") {
    reply = t.help;
  } else {
    const aiReply = await getAiCompletion({ message: text, language: selectedLanguage }).catch(() => "");
    reply = aiReply || t.help;
  }

  if (user) {
    await ChatLog.create({
      userId: user._id,
      role: "assistant",
      language: selectedLanguage,
      message: reply,
      meta: complaintCreated
        ? {
            complaintId: complaintCreated._id.toString(),
            ticketId: complaintCreated.ticketId
          }
        : {}
    });
  }

  return res.json({
    reply,
    intent,
    complaint: complaintCreated
      ? {
          id: complaintCreated._id,
          ticketId: complaintCreated.ticketId,
          status: complaintCreated.status
        }
      : null
  });
});

export default router;
