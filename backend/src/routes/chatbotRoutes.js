import express from "express";
import { detectIntent, extractTicketId } from "../services/intent.js";
import { getText } from "../services/i18n.js";
import { getAiCompletion } from "../services/openai.js";

const router = express.Router();

const complaintStore = new Map();
let complaintCounter = 0;

function nextTicketId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  complaintCounter += 1;
  return `CMP-${yyyy}${mm}${dd}-${String(complaintCounter).padStart(4, "0")}`;
}

router.post("/message", async (req, res) => {
  try {
    const text = String(req.body?.message || "").trim();
    const language = String(req.body?.language || "en").toLowerCase();
    const imageUrl = String(req.body?.imageUrl || "");
    const i18n = getText(language);

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "message or imageUrl is required" });
    }

    const intent = detectIntent(text);

    if (intent === "complaint") {
      const ticketId = nextTicketId();
      complaintStore.set(ticketId, {
        ticketId,
        status: "Open",
        message: text || "Complaint submitted via image",
        imageUrl,
        createdAt: new Date().toISOString()
      });

      return res.json({
        reply: i18n.ticketCreated(ticketId),
        intent,
        complaint: { ticketId, status: "Open" }
      });
    }

    if (intent === "track") {
      const ticketId = extractTicketId(text);
      if (!ticketId) {
        return res.json({ reply: i18n.trackNeedTicket, intent });
      }

      const complaint = complaintStore.get(ticketId);
      if (!complaint) {
        return res.json({ reply: i18n.noTicketFound, intent });
      }

      return res.json({
        reply: `Ticket ${ticketId} is currently ${complaint.status}.`,
        intent,
        complaint: { ticketId, status: complaint.status }
      });
    }

    if (intent === "schedule") {
      return res.json({ reply: i18n.schedule, intent });
    }

    if (intent === "segregation") {
      return res.json({ reply: i18n.segregation, intent });
    }

    if (intent === "help") {
      return res.json({ reply: i18n.help, intent });
    }

    const aiReply = await getAiCompletion({ message: text, language });
    if (aiReply) {
      return res.json({ reply: aiReply, intent: "general" });
    }

    return res.json({ reply: i18n.greet, intent: "general" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process chatbot message" });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "wds-chatbot" });
});

export default router;
