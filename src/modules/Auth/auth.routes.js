import { express } from "#packages/index.js";

import dtos from "#dtos/index.js";
import middleware from "#middleware/index.js";
import authController from "./auth.controller.js";

export const authRoutes = express.Router();

authRoutes
  .post("/signup", middleware.validateDto(dtos.signUp), authController.signUp)
  .post("/signin", middleware.validateDto(dtos.signIn), authController.signIn)
  .post("/signout", authController.signOut)
  .post(
    "/forgot-password",
    middleware.validateDto(dtos.forgotPassword),
    authController.forgotPassword,
  );
