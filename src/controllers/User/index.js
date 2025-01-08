import { UsersService } from "#services/index.js";

export const UsersController = {
  getAll: async (_, res) => {
    try {
      const result = await UsersService.getAll();

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  getById: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await UsersService.getById(userId);

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  updateById: async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = req.body;

      const result = await UsersService.updateById(userId, userData);

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await UsersService.deleteById(userId);

      res.status(201).json(result);
    } catch (error) {
      res.status(error?.status).json({ message: error?.message });
    }
  },
};
