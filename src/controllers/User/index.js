import { UsersService } from "#services/index.js";

export const UsersController = {
  getAll: async (_, res) => {
    try {
      const result = await UsersService.getAll();

      res.status(201).json(result);
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ message: error?.message || error });
    }
  },
  getById: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await UsersService.getById(userId);

      res.status(201).json(result);
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ message: error?.message || error });
    }
  },
  updateById: async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = req.body;

      const result = await UsersService.updateById(userId, userData);

      res.status(201).json(result);
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ message: error?.message || error });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await UsersService.deleteById(userId);

      res.status(201).json(result);
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ message: error?.message || error });
    }
  },
};
