import { User, BlacklistedToken } from "#models/index.js";

export const dataAccess = {
  save: {
    user: async (userData) => {
      return await User.create(userData);
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
      return await User.findOne({ email });
    },

    userById: async (id) => {
      return await User.findById(id);
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.findOne({ token });
    },
  },

  update: {
    updateUserById: async (id, userData) => {
      return await User.findByIdAndUpdate(id, userData, {
        new: true,
        upsert: true,
      });
    },

    forgottenPassword: async (email, password) => {
      return await User.findOneAndUpdate(
        { email },
        { password },
        { new: true, upsert: true }
      );
    },
  },

  remove: {
    userById: async (id) => await User.findByIdAndDelete(id),
  },
};
