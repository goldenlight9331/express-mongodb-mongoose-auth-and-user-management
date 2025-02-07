import { express } from "#packages/index.js";

import middleware from "#middleware/index.js";
import userController from "./user.controller.js";

export const userRoutes = express.Router();

userRoutes
  .get("/", userController.getAll)
  .get("/:id", userController.getById)
  .patch("/:id", middleware.uploadFiles, userController.updateById)
  .delete("/:id", userController.deleteById);
