import mongoose from "mongoose";

const apiPaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    pickupRequestId: { type: String, default: "", index: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, default: "Paid", index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    reference: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

apiPaymentSchema.index({ userId: 1, status: 1 });

export const ApiPayment = mongoose.models.ApiPayment || mongoose.model("ApiPayment", apiPaymentSchema);
