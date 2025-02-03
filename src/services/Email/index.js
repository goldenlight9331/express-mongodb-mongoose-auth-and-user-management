import utilities from "#utilities/index.js";
import { dataAccess } from "#dataAccess/index.js";
import { createError } from "#packages/index.js";

const { decodeToken, verificationNotification } = utilities;
const { update } = dataAccess;

export const EmailService = {
  verifyEmail: async (verificationToken) => {
    const decoded = await decodeToken(verificationToken);
    if (!decoded) {
      throw createError(400, "Invalid verification token");
    }

    const userId = decoded.userId;

    const isUserUpdated = await update.userById(userId, {
      isEmailVerified: true,
    });
    if (!isUserUpdated) {
      throw createError(500, "An error occurred while verifying the email");
    }

    const result = verificationNotification();

    return result;
  },
};
