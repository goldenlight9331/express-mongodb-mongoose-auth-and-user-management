import createError from "http-errors";

import { asyncHandler } from "#utils/index.js";

const validateDto = (schema) =>
  asyncHandler(async (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(({ message }) => message);
      throw createError(400, `Validation failed: ${errorMessages.join(", ")}`);
    }
    req.body = value;
    next();
  });

export { validateDto };
