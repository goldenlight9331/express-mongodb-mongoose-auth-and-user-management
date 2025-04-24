import { user } from "./user.data-access.js";
import { blacklistedToken } from "./blacklisted-token.data-access.js";
import { otp } from "./otp.data-access.js";

export const dataAccess = {
  save: {
    ...user.save,
    ...blacklistedToken.save,
    ...otp.save,
  },

  read: {
    ...user.read,
    ...blacklistedToken.read,
    ...otp.read,
  },

  update: {
    ...user.update,
  },

  remove: {
    ...user.remove,
  },
};
