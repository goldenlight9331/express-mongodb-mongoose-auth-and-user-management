import { createError } from '#packages/index.js';
import { tokenUtils, handleError } from '#utils/index.js';
import { User } from '#models/index.js';

export const AuthService = {
  signUp: async userData => {
    try {
      const { email } = userData;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw createError(400, 'User with the provided email already exists');
      }

      const user = new User(userData);
      user.save();

      const token = tokenUtils.generateAuthToken(user);

      return {
        name: user.name,
        email: user.email,
        token,
      };
    } catch (error) {
      return handleError(error, 'Failed to sign up user');
    }
  },
  signIn: async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw createError(401, 'Invalid credentials');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw createError(401, 'Invalid credentials');

      const token = tokenUtils.generateAuthToken(user);

      return {
        name: user.name,
        email: user.email,
        token,
      };
    } catch (error) {
      return handleError(error, 'Failed to sign in user');
    }
  }
};
