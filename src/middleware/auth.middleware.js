import createError from "http-errors";

import { env } from "#config/index.js";
import { asyncHandler, decodeToken } from "#utils/index.js";

const { COOKIE_NAME } = env;

const verifyAuthToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    throw createError(401, "Token is missing in the authorization cookie.");
  }

  const decoded = await decodeToken(token);
  if (!decoded) {
    throw createError(401, "Invalid or expired token.");
  }
  req.user = decoded;
  next();
});

const verifyAuthRole = (authorizedRole) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError(401, "Authentication required.");
    }
    if (req.user.role !== authorizedRole) {
      throw createError(403, `Access denied: ${authorizedRole} role required.`);
    }
    next();
  });

export { verifyAuthToken, verifyAuthRole };
