import express from "express";

import userController from "./user.controller.js";
import { uploadFiles, verifyAuthRole } from "#middleware/index.js";

export const userRoutes = express.Router();

userRoutes
  .get("/", userController.getAll)
  .get("/:id", userController.getById)
  .patch("/:id", uploadFiles, userController.updateById)
  .delete("/:id", verifyAuthRole("admin"), userController.deleteById);
