import utility from "#utility/index.js";
import { dataAccess } from "#dataAccess/index.js";
import { createError } from "#packages/index.js";

const { hashPassword } = utility;
const { save, fetch, update, remove } = dataAccess;

export const UserService = {
  getAll: async () => {
    const users = await fetch.allUsers();
    if (!users || users.length === 0) {
      throw createError(404, "No users found");
    }

    return users;
  },

  getById: async (userId) => {
    const user = await fetch.userById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    return user;
  },

  updateById: async (userId, userData) => {
    const user = await update.userById(userId, userData);
    if (!user) {
      throw createError(404, "User not found or update failed");
    }

    return "User updated successfully";
  },

  updateByEmail: async (email, password) => {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw createError(500, "An error occurred while hashing the password.");
    }

    const user = await update.userByEmail(email, hashedPassword);
    if (!user) {
      throw createError(404, "User not found or update failed");
    }

    return "User updated successfully";
  },

  deleteById: async (userId) => {
    const user = await remove.userById(userId);
    if (!user) {
      throw createError(404, "User not found or deletion failed");
    }

    return "User deleted successfully";
  },
};
