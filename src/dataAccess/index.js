import { User, BlacklistedToken } from "#models/index.js";
import { axios } from "#packages/index.js";

export const dataAccess = {
  save: {
    user: async (firstName, lastName, email, password, role) => {
      return await User.create({ firstName, lastName, email, password, role });
    },
    blacklistedToken: async (token) => {
      return await BlacklistedToken.create({ token });
    },
  },
  fetch: {
    allUsers: async () => {
      return await User.find();
    },
    userByEmail: async (email) => {
      return await User.findOne({
        email,
      });
    },
    userById: async (userId) => {
      return await User.findById(id).select("-password");
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.findOne({ token });
    },
  },
  update: {
    userById: async (userId, userData) => {
      return await User.findByIdAndUpdate(userId, userData, {
        new: true,
        upsert: true,
      });
    },

    forgottenPassword: async (email, password) => {
      return await User.findOneAndUpdate(
        { email },
        { password },
        { new: true, upsert: true },
      );
    },
  },
  remove: {
    userById: async (userId) => {
      return await User.findByIdAndDelete(userId);
    },
  },
};
