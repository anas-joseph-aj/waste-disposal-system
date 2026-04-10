import mongoose from "mongoose";

const apiComplaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Open", index: true },
    priority: { type: String, default: "Medium" },
    resolution: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

apiComplaintSchema.index({ userId: 1, status: 1 });

export const ApiComplaint = mongoose.models.ApiComplaint || mongoose.model("ApiComplaint", apiComplaintSchema);
