import { bcryptjs, createError } from '#packages/index.js';
import { tokenUtils, logger, handleError } from '#utils/index.js';
import { dotEnv } from '#dotenv/index.js';
import { User } from '#models/index.js';

const { JWT_EXPIRATION } = dotEnv;

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
        isApproved: user.isApproved,
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

      const isApproved = user.isApproved;
      if (!isApproved)
        throw createError(403, 'User account is not approved yet');

      const token = tokenUtils.generateAuthToken(user);

      return {
        name: user.name,
        email: user.email,
        token,
        isApproved: user.isApproved,
      };
    } catch (error) {
      return handleError(error, 'Failed to sign in user');
    }
  },
  signOut: async token => {
    try {
      const JWT_EXPIRATION = Number(JWT_EXPIRATION) * 1000;
      if (isNaN(JWT_EXPIRATION)) {
        throw createError(500, 'Invalid JWT_EXPIRATION value');
      }

      await tokenUtils.revokeToken(token, JWT_EXPIRATION);

      return 'Logout successful';
    } catch (error) {
      return handleError(error, 'Failed to sign out user');
    }
  },
};
