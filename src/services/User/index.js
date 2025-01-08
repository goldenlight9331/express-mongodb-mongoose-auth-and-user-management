import { createError } from '#packages/index.js';
import { handleError } from '#utils/index.js';
import { dataAccess } from '#dataAccess/index.js';

const { fetchAllUsers, findUserById, updateUserById, deleteUserById } =
  dataAccess;

export const UsersService = {
  getAll: async () => {
    try {
      const users = await fetchAllUsers();

      if (!users.length) {
        throw createError(404, 'Users not found');
      }

      return users;
    } catch (error) {
      return handleError(error, 'Failed to fetch users');
    }
  },
  getById: async (userId) => {
    try {
      const user = await findUserById(userId);

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
      const user = await updateUserById(userId, userData);

      if (!user) {
        throw createError(404, 'User not found');
      }

      return user;
    } catch (error) {
      return handleError(error, `Failed to update user by id: ${userId}`);
    }
  },
  deleteById: async (userId) => {
    try {
      const user = await deleteUserById(userId);

      if (!user) {
        throw createError(404, 'User not found');
      }

      return 'User deleted successfully';
    } catch (error) {
      return handleError(error, `Failed to delete user by id: ${userId}`);
    }
  },
};
