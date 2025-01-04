import { jwt } from '#packages/index.js';
import { handleError, logger, dotEnv } from '#utils/index.js';

const { JWT_SECRET } = dotEnv;

export const validate = {
  dto: schema => async (req, res, next) => {
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
  },

  authToken: async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        logger.error('Unauthorized: No token provided');
        return res
          .status(401)
          .json({ error: 'Unauthorized: No token provided' });
      }

      try {
        const decoded = await jwt.verify(token, JWT_SECRET);

        req.decoded = decoded;
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('token');
          logger.error('Session expired. Please log in again.');
          return res
            .status(401)
            .json({ message: 'Session expired. Please log in again.' });
        }

        logger.error('Invalid token');
        return res.status(403).json({ message: 'Invalid token' });
      }
    } catch (error) {
      return handleError(error, 'Failed to validate token');
    }
  },

  authRole: admin => (req, res, next) => {
    if (req.decoded.role !== admin) {
      logger.error('Forbidden: Admin access required');
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }

    next();
  },
};
