import { User, BlacklistedToken } from "#models/index.js";

export const dataAccess = {
  save: {
    user: async (firstName, lastName, userName, email, password, role) => {
      return await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        role,
      });
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.create({ token });
    },
  },

  read: {
    allUsers: async () => {
      return await User.find().select("-password -isRemembered");
    },

    byEmail: async (email) => {
      return await User.findOne({
        email,
      });
    },

    byUserId: async (id) => {
      return await User.findById(id).select("-password");
    },

    byUsername: async (userName) => {
      return await User.findOne({ userName }).select("-password");
    },

    blacklistedToken: async (token) => {
      return await BlacklistedToken.findOne({ token });
    },
  },

  update: {
    byUserId: async (id, userData) => {
      return await User.findByIdAndUpdate(id, userData, {
        new: true,
        upsert: true,
      }).select("-password");
    },

    byEmail: async (email, userData) => {
      return await User.findOneAndUpdate({ email }, userData, {
        new: true,
        upsert: true,
      }).select("-password");
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
    byUserId: async (id) => {
      return await User.findByIdAndDelete(id);
    },
  },
};
