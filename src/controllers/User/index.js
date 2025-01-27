import utility from "#utility/index.js";
import { UserService } from "#services/index.js";

const { asyncHandler } = utility;

export const UserController = {
  getAll: asyncHandler(async (_, res) => {
    const result = await UserService.getAll();
    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await UserService.getById(userId);
    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    const result = await UserService.updateById(userId, userData);
    res.status(200).json(result);
  }),

  deleteById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await UserService.deleteById(userId);
    res.status(200).json(result);
  }),
};
