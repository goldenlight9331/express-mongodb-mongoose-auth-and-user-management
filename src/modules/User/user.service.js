import { createError } from "#packages/index.js";

import utilities from "#utilities/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { fetch, update, remove } = dataAccess;
const { deleteFile } = utilities;

const userService = {
  getAll: async () => {
    const users = await fetch.allUsers();
    if (!users.length) {
      throw createError(404, "Users not found");
    }

    return users;
  },
  getById: async (id) => {
    const user = await fetch.userById(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    return user;
  },
  updateById: async (id, userData) => {
    // Fetch the existing user data
    const existingUser = await fetch.userById(id);
    if (!existingUser) {
      throw createError(404, "User not found");
    }

    // If a new profile picture is uploaded, delete the old one
    if (userData.profilePicture && existingUser.profilePicture) {
      deleteFile(existingUser.profilePicture); // Delete the old profile picture
    }

    // Update the user data
    const updatedUser = await update.userById(id, userData);
    if (!updatedUser) {
      throw createError(500, "User update failed");
    }

    return updatedUser;
  },
  deleteById: async (id) => {
    const user = await remove.userById(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    return "User deleted successfully";
  },
};

export default userService;
