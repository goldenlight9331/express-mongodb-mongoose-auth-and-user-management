import { bcryptjs, createError } from '#packages/index.js';
import { tokenUtils, logger } from '#utils/index.js';
import { dotEnv } from '#dotenv/index.js';
import { User } from '#models/index.js';

const { JWT_EXPIRATION } = dotEnv;

export const UsersService = {
  getAll: async () => {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      logger.error(error);

      throw createError(500, 'Internal Server Error');
    }
  },
  getById: async userId => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw createError(404, 'User not found');
      }

      return user;
    } catch (error) {
      logger.error(error);

      throw createError(500, 'Internal Server Error');
    }
  },
  updateById: async (userId, userData) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw createError(404, 'User not found');
      }

      Object.assign(user, userData);

      await user.save();

      return user;
    } catch (error) {
      logger.error(error);

      throw createError(500, 'Internal Server Error');
    }
  },
  deleteById: async userId => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw createError(404, 'User not found');
      }

      await user.remove();

      return user;
    } catch (error) {
      logger.error(error);

      throw createError(500, 'Internal Server Error');
    }
  },
};
