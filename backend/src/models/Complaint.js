import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reportedByName: { type: String, default: "Guest" },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Completed"],
      default: "Pending"
    },
    assignedCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    routeHint: { type: String, default: "" },
    lastUpdateByRole: { type: String, default: "user" }
  },
  { timestamps: true }
);

export const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
