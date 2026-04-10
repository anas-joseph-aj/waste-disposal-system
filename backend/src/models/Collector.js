import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    vehicleId: { type: String, default: "" },
    zone: { type: String, default: "City" },
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }]
  },
  { timestamps: true }
);

export const Collector = mongoose.models.Collector || mongoose.model("Collector", collectorSchema);
