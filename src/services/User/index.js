import utilities from "#utilities/index.js";
import { createError } from "#packages/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { fetch, update, remove } = dataAccess;
const { deleteFile } = utilities;

export const UserService = {
  getAll: async () => {
    const users = await fetch.allUsers();
    if (!users.length) {
      throw createError(404, "Users not found");
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
    // Fetch the existing user data
    const existingUser = await fetch.userById(userId);
    if (!existingUser) {
      throw createError(404, "User not found");
    }

    // If a new profile picture is uploaded, delete the old one
    if (userData.profilePicture && existingUser.profilePicture) {
      deleteFile(existingUser.profilePicture); // Delete the old profile picture
    }

    // Update the user data
    const updatedUser = await update.userById(userId, userData);
    return updatedUser;
  },

  deleteById: async (userId) => {
    const user = await remove.userById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    return "User deleted successfully";
  },
};
