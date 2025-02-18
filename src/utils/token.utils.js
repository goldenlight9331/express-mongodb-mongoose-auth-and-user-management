import jwt from "jsonwebtoken";
import createError from "http-errors";

import { env, logger } from "#config/index.js";

const { JWT_SECRET_KEY, JWT_SHORT_EXPIRY, JWT_LONG_EXPIRY } = env;

const generateToken = (userId, role, isRemembered = false) => {
  try {
    const expiry = isRemembered ? JWT_LONG_EXPIRY : JWT_SHORT_EXPIRY;
    return jwt.sign({ id: userId, role }, JWT_SECRET_KEY, {
      expiresIn: expiry,
    });
  } catch (error) {
    logger.error("An error occurred while generating the token", error);
    throw createError(500, "An error occurred while generating the token");
  }
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    logger.error("An error occurred while decoding the token", error);
    throw createError(401, "Invalid token");
  }
};

export { generateToken, decodeToken };
