import mongoose from "mongoose";

const { Schema } = mongoose;

const OtpSchema = new Schema({
  otpHash: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index: auto-delete after expiry
  },
});

export const OtpModel = mongoose.model("Otp", OtpSchema);
