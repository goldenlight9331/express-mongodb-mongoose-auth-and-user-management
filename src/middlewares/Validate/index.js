import { jwt } from '#packages/index.js';
import { handleError, logger, dotEnv } from '#utils/index.js';

const { JWT_SECRET } = dotEnv;

export const validate = {
  authPayload: schema => async (req, res, next) => {
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
      const token = req.header('Authorization')?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
      });
    } catch (error) {
      return handleError(error, 'Failed to validate token');
    }
  },
  authRoles: admin => {
    return (req, res, next) => {
      if (req.user.role !== admin) {
        return res.status(403).json({ message: 'Forbidden: Access Denied' });
      }
      next();
    };
  },
};
