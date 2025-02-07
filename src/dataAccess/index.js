import { User, BlacklistedToken } from "#models/index.js";

export const dataAccess = {
  save: {
    user: async (firstName, lastName, email, password, role, isApproved) => {
      return await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        isApproved,
      });
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.create({ token });
    },
  },

  fetch: {
    allUsers: async () => {
      return await User.find().select("-password");
    },

    userByEmail: async (email) => {
      return await User.findOne({
        email,
      });
    },

    userById: async (id) => {
      return await User.findById(id).select("-password");
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.findOne({ token });
    },
  },

  update: {
    userById: async (id, userData) => {
      return await User.findByIdAndUpdate(id, userData, {
        new: true,
        upsert: true,
      }).select("-password");
    },

    userByEmail: async (email, userData) => {
      return await User.findOneAndUpdate({ email }, userData, {
        new: true,
        upsert: true,
      }).select("-password");
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
    userById: async (id) => {
      return await User.findByIdAndDelete(id);
    },
  },
};
