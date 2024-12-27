import { jwt, createError } from '#packages/index.js';
import { handleError, dotEnv } from '#utils/index.js';
const { NODE_ENV, JWT_SECRET } = dotEnv;

export const tokenUtils = {
  verifyToken: async token => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        throw createError(401, 'Token invalid');
      }
      return decoded;
    } catch (error) {
      return handleError(error, 'Failed to verify token');
    }
  },
  generateAuthToken: user => {
    try {
      const { name, email, _id } = user;
      const token = jwt.sign(
        {
          id: _id.toString(),
          email,
          name,
        },
        JWT_SECRET,
        { expiresIn: '1h' },
      );
      return token;
    } catch (error) {
      return handleError(error, 'Failed to generate token');
    }
  },
};
