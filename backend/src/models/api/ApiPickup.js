import mongoose from "mongoose";

const apiPickupSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    wasteType: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    address: { type: String, required: true },
    preferredDate: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Assigned", "In-Progress", "Completed"], default: "Pending", index: true },
    collectorId: { type: String, default: "", index: true },
    notes: { type: String, default: "" },
    wasteImage: { type: String, default: "" },
    collectorProofImage: { type: String, default: "" },
    paymentId: { type: String, default: "", index: true },
    fee: { type: Number, default: 50 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

apiPickupSchema.index({ userId: 1, status: 1 });
apiPickupSchema.index({ collectorId: 1, status: 1 });

export const ApiPickup = mongoose.models.ApiPickup || mongoose.model("ApiPickup", apiPickupSchema);
