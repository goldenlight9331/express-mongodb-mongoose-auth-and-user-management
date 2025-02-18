import { user } from "./user.data-access.js";
import { blacklistedToken } from "./blacklisted-token.data-access.js";

export const dataAccess = {
  save: {
    ...user.save,
    ...blacklistedToken.save,
  },

  read: {
    ...user.read,
    ...blacklistedToken.read,
  },

  update: {
    ...user.update,
  },

  remove: {
    ...user.remove,
  },
};
