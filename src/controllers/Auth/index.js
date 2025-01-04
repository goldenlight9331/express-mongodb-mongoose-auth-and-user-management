import { AuthService } from '#services/index.js';
import { dotEnv } from '#utils/Dotenv/index.js';

const { CookieKey, CookieSameSite, CookieSecure, CookieMaxAge } = dotEnv;

const cookieOptions = {
  httpOnly: CookieKey,
  secure: CookieSecure,
  sameSite: CookieSameSite,
  maxAge: CookieMaxAge,
};

export const AuthController = {
  signUp: async (req, res) => {
    try {
      const userData = req.body;

      const result = await AuthService.signUp(userData);
      const token = result.token;

      res
        .status(201)
        .cookie('token', token, cookieOptions)
        .json({ ...result, token: undefined });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  signIn: async (req, res) => {
    try {
      const userData = req.body;

      const result = await AuthService.signIn(userData);
      const token = result.token;

      res
        .status(200)
        .cookie('token', token, cookieOptions)
        .json({ ...result, token: undefined });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  signOut: async (_, res) => {
    try {
      res.clearCookie('token').status(200).json({ message: 'Signed out' });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
};
