import mongoose from "mongoose";

const apiSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    pickupFee: { type: Number, default: 50 }
  },
  { timestamps: true }
);

export const ApiSetting = mongoose.models.ApiSetting || mongoose.model("ApiSetting", apiSettingSchema);
