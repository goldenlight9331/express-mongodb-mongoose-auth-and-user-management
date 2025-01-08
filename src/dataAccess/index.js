import { User, BlacklistedToken } from "#models/index.js";

export const dataAccess = {
  createUser: async (userData) => await User.create(userData),
  findUserByEmail: async (email) => await User.findOne({ email }),
  fetchAllUsers: async () => await User.find(),
  findUserById: async (id) => await User.findById(id),
  updateUserById: async (id, userData) =>
    await User.findByIdAndUpdate(id, userData, { new: true, upsert: true }),
  deleteUserById: async (id) => await User.findByIdAndDelete(id),
  expireToken: async (token) => await BlacklistedToken.create({ token }),
};
