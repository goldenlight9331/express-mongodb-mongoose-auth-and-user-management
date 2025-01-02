import { AuthService } from '#services/index.js';

export const AuthController = {
  signUp: async (req, res) => {
    try {
      const userData = req.body;

      const result = await AuthService.signUp(userData);

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  signIn: async (req, res) => {
    try {
      const userData = req.body;

      const result = await AuthService.signIn(userData);

      res.status(200).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
};
