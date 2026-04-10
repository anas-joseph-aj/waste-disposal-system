import mongoose from "mongoose";

const apiFeedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    pickupRequestId: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    moderationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true
    },
    moderatedBy: { type: String, default: "" },
    moderatedAt: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

apiFeedbackSchema.index({ userId: 1, pickupRequestId: 1 }, { unique: true });

export const ApiFeedback = mongoose.models.ApiFeedback || mongoose.model("ApiFeedback", apiFeedbackSchema);
