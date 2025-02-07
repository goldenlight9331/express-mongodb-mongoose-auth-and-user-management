import { express } from "#packages/index.js";

import emailController from "./email.controller.js";

export const emailRoutes = express.Router();

emailRoutes.get("/verify/:verificationToken", emailController.verifyEmail);
