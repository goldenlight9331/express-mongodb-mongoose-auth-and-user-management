import { User } from "#models/index.js";

export const user = {
  save: {
    user: async (firstName, lastName, username, email, password, role) => {
      return await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      });
    },
  },

  read: {
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

    userByUsername: async (username) => {
      return await User.findOne({ username }).select("-password");
    },
  },

  update: {
    userById: async (id, userData) => {
      return await User.findByIdAndUpdate(id, userData, {
        new: true,
        upsert: true,
      });
    },

    userByEmail: async (email, userData) => {
      return await User.findOneAndUpdate({ email }, userData, {
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
    userById: async (id) => {
      return await User.findByIdAndDelete(id);
    },
  },
};
