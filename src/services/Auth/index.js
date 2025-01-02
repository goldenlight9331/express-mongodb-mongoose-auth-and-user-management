import { createError } from '#packages/index.js';
import { generateAuthToken, handleError } from '#utils/index.js';
import { User } from '#models/index.js';

export const AuthService = {
  signUp: async userData => {
    try {
      const { email } = userData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(400, 'User with the provided email already exists');
      }

      const user = await User.create(userData);
      const token = generateAuthToken(user);

      const result = {
        name: user.name,
        email: user.email,
        role: user.role,
        token: `Bearer ${token}`,
      };

      return result;
    } catch (error) {
      return handleError(error, 'Failed to sign up user');
    }
  },
  signIn: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw createError(401, 'Invalid credentials');

      await user.comparePassword(password);

      const token = generateAuthToken(user);

      const result = {
        name: user.name,
        email: user.email,
        role: user.role,
        token: `Bearer ${token}`,
      };

      return result;
    } catch (error) {
      return handleError(error, 'Failed to sign in user');
    }
  },
};
