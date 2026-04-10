import mongoose from "mongoose";

const apiUserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["user", "collector", "admin"], default: "user", index: true },
    profileImage: { type: String, default: "" },
    employeeId: { type: String, default: "", uppercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

apiUserSchema.index({ email: 1, isActive: 1 });
apiUserSchema.index({ employeeId: 1, isActive: 1 });

export const ApiUser = mongoose.models.ApiUser || mongoose.model("ApiUser", apiUserSchema);
