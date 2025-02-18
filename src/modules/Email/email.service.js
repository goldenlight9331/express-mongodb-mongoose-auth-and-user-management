import createError from "http-errors";

import {
  decodeToken,
  generateToken,
  sendVerificationNotification,
  sendVerificationEmail,
} from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

const emailService = {
  verify: async (verificationToken) => {
    const decoded = await decodeToken(verificationToken);
    if (!decoded) {
      throw createError(400, "Invalid token");
    }

    const id = decoded["0"];
    if (!id) {
      throw createError(400, "Token does not contain the user id");
    }

    const isUserUpdated = await update.userById(id, {
      isEmailVerified: true,
    });
    if (!isUserUpdated) {
      throw createError(500, "An error occurred while verifying the email");
    }

    return sendVerificationNotification();
  },

  send: async (email) => {
    const user = await read.userByEmail(email);
    if (!user) {
      throw createError(404, "User not found");
    }

    const verificationToken = generateToken(user._id);
    if (!verificationToken) {
      await remove.userById(user._id);
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      await remove.userById(user._id);
      throw createError(500, "Failed to send the welcome email.");
    }

    return "Verification email sent successfully";
  },
};

export default emailService;
