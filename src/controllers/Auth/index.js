import { AuthService } from '#services/index.js';
import { tokenUtils } from '#utils/index.js';

export const AuthController = {
  signUp: async (req, res, next) => {
    try {
      const userData = req.body;

      const result = await AuthService.signUp(userData);

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  signIn: async (req, res, next) => {
    try {
      const userData = req.body;

      const result = await AuthService.signIn(userData);

      res.status(200).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  signOut: async (req, res, next) => {
    try {
      const { token } = req.headers;

      const result = await AuthService.signOut(token);

      res.status(200).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
};
