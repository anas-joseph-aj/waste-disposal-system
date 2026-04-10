import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    language: { type: String, enum: ["en", "hi", "kn"], default: "en" },
    message: { type: String, required: true, trim: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const ChatLog = mongoose.models.ChatLog || mongoose.model("ChatLog", chatLogSchema);
