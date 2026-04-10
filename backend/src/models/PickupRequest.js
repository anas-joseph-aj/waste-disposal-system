import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    reference: { type: String, default: "" },
    paidAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { _id: false }
);

const pickupRequestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    wasteType: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Checking", "Assigning", "Completed"],
      default: "Pending"
    },
    assignedCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    wasteImage: { type: String, default: "" },
    proofImage: { type: String, default: "" },
    payment: { type: paymentSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export const PickupRequest =
  mongoose.models.PickupRequest || mongoose.model("PickupRequest", pickupRequestSchema);
