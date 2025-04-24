import createError from "http-errors";
import bcrypt from "bcryptjs";

import { generateOtp, sendOtpEmail } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { save, read } = dataAccess;

const otpService = {
  send: async ({ email }) => {
    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(400, "A user with this email does not exist.");
    }

    const { rawOtp, hashedOtp, expiresAt } = await generateOtp();

    const isOtpSaved = await save.otp({
      otpHash: hashedOtp,
      userId: existingUser._id,
      expiresAt,
    });

    if (!isOtpSaved) {
      throw new Error("Failed to save OTP.");
    }

    await sendOtpEmail(email, rawOtp);

    return { success: true, message: "Password reset code sent successfully" };
  },

  verify: async ({ email, otp: recievedOtp }) => {
    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(400, "A user with this email does not exist.");
    }

    const existingOtps = await read.otp(existingUser._id);

    if (!existingOtps || !existingOtps.length) {
      throw createError(400, "Invalid OTP");
    }

    const comparisonResults = await Promise.all(
      existingOtps.map((existingOtp) =>
        bcrypt.compare(recievedOtp, existingOtp.otpHash),
      ),
    );

    const isOtpValid = comparisonResults.some((result) => result === true);

    if (!isOtpValid) {
      throw createError(400, "Invalid OTP");
    }

    return { success: true, message: "OTP Verified" };
  },
};

export default otpService;
