import { createError } from "#packages/index.js";

import utilities from "#utilities/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { decodeToken, verificationNotification } = utilities;
const { update } = dataAccess;

const emailService = {
  verifyEmail: async (verificationToken) => {
    const decoded = await decodeToken(verificationToken);
    if (!decoded) {
      throw createError(400, "Invalid verification token");
    }

    const id = decoded.id;

    const isUserUpdated = await update.userById(id, {
      isEmailVerified: true,
    });
    if (!isUserUpdated) {
      throw createError(500, "An error occurred while verifying the email");
    }

    const result = verificationNotification();

    return result;
  },
};

export default emailService;
