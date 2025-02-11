import { express } from "#packages/index.js";

import emailController from "./email.controller.js";

export const emailRoutes = express.Router();

emailRoutes
  .get("/verify-email/:verificationToken", emailController.verifyEmail)
  .post("/send-verification-email", emailController.sendVerificationEmail);
