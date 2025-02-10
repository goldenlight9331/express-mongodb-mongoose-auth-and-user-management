import { createError, path, fileURLToPath, dirname } from "#packages/index.js";

import { deleteFile } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userService = {
  getAll: async () => {
    const users = await read.allUsers();
    if (!users.length) {
      throw createError(404, "Users not found");
    }

    return users;
  },
  getById: async (id) => {
    const user = await read.byUserId(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    return user;
  },
  updateById: async (id, userData) => {
    const existingUser = await read.byUserId(id);
    if (!existingUser) {
      throw createError(404, "User not found");
    }

    if (userData.userName && userData.userName !== existingUser.userName) {
      const userWithSameUsername = await read.byUsername(userData.userName);
      if (userWithSameUsername) {
        throw createError(409, "Username already exists");
      }
    }

    if (userData.profilePicture && existingUser.profilePicture) {
      const oldProfilePicturePath = path.join(
        __dirname,
        "../../../public/uploads",
        existingUser.profilePicture
      );
      deleteFile(oldProfilePicturePath);
    }

    const updatedUser = await update.byUserId(id, userData);
    if (!updatedUser) {
      throw createError(500, "User update failed");
    }

    return updatedUser;
  },
  deleteById: async (id) => {
    const user = await remove.byUserId(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    return "User deleted successfully";
  },
};

export default userService;
