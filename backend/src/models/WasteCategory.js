import mongoose from "mongoose";

const wasteCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const WasteCategory =
  mongoose.models.WasteCategory || mongoose.model("WasteCategory", wasteCategorySchema);
