import { asyncHandler } from "#utils/index.js";
import userService from "./user.service.js";

const userController = {
  getAll: asyncHandler(async (_, res) => {
    const result = await userService.getAll();
    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await userService.getById(id);
    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture[0];
      userData.profilePicture = `/uploads/${file.filename}`;
    }

    const result = await userService.updateById(id, userData);
    res.status(200).json(result);
  }),

  deleteById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await userService.deleteById(id);
    res.status(204).json(result);
  }),
};

export default userController;
