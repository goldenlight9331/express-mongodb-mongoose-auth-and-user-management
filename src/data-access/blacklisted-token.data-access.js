import { BlacklistedToken } from "#models/index.js";

export const blacklistedToken = {
  save: {
    blacklistedToken: async (token) => {
      return await BlacklistedToken.create({ token });
    },
  },

  read: {
    blacklistedToken: async (token) => {
      return await BlacklistedToken.findOne({ token });
    },
  },
};
