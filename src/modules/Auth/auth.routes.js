import { express } from "#packages/index.js";

import dtos from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import authController from "./auth.controller.js";

export const authRoutes = express.Router();

authRoutes
  .post("/signup", validateDto(dtos.signUp), authController.signUp)
  .post("/signin", validateDto(dtos.signIn), authController.signIn)
  .post("/signout", authController.signOut)
  .post(
    "/forgot-password",
    validateDto(dtos.forgotPassword),
    authController.forgotPassword,
  );
