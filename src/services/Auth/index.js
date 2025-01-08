import { createError } from "#packages/index.js";
import { handleError } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { createUser, findUserByEmail } = dataAccess;

export const AuthService = {
  signUp: async (userData) => {
    try {
      const { email } = userData;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw createError(400, "User with the provided email already exists");
      }

      const user = await createUser(userData);
      const token = user.generateAuthToken();

      const result = {
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      };

      return result;
    } catch (error) {
      return handleError(error, "Failed to sign up user");
    }
  },
  signIn: async ({ email, password }) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) throw createError(401, "Invalid credentials");

      await user.comparePassword(password);
      const token = user.generateAuthToken();

      const result = {
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      };

      return result;
    } catch (error) {
      return handleError(error, "Failed to sign in user");
    }
  },
};
