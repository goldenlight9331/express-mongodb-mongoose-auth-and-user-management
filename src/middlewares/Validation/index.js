import { logger } from '#utils/index.js';

export const validateMiddleware = schema => async (req, res, next) => {
  try {
    const { value, error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);

      logger.warn({
        message: 'Validation failed',
        method: req.method,
        url: req.originalUrl,
        errors: errorMessages,
      });

      return res.status(400).json({ errors: errorMessages });
    }

    req.body = value;

    next();
  } catch (error) {
    return handleError(error, 'Failed to validate request');
  }
};
