import { createError } from '#packages/index.js';
import { handleError } from '#utils/index.js';
import { User } from '#models/index.js';

export const UsersService = {
  getAll: async () => {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      return handleError(error, 'Failed to fetch users');
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
      return handleError(error, `Failed to fetch user by id: ${userId}`);
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
      return handleError(error, `Failed to update user by id: ${userId}`);
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
      return handleError(error, `Failed to delete user by id: ${userId}`);
    }
  },
};
