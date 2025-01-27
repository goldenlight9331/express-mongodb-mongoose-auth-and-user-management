import utility from "#utility/index.js";
import { createError } from "#packages/index.js";

const { logger, asyncHandler } = utility;

export const validate = {
  dto: (schema) =>
    asyncHandler(async (req, res, next) => {
      const { value, error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw createError(
          400,
          `Validation failed: ${errorMessages.join(", ")}`,
        );
      }

      req.body = value;
      next();
    }),

  authToken: asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!authHeader) {
      throw createError(403, "Authorization header is missing.");
    }

    if (!token) {
      throw createError(403, "Token is missing in the authorization header.");
    }

    const decoded = await utility.decodeToken(token);

    if (!decoded) {
      throw createError(401, "Invalid or expired token.");
    }

    req.user = decoded;
    next();
  }),

  authRole: (authorizedRole) => {
    return asyncHandler(async (req, res, next) => {
      if (!req.user) {
        throw createError(401, "Authentication required.");
      }

      if (req.user.role !== authorizedRole) {
        throw createError(
          403,
          `Access denied: ${authorizedRole} role required.`,
        );
      }

      next();
    });
  },
};
