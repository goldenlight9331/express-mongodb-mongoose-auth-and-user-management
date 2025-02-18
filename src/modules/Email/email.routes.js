import express from "express";

import emailController from "./email.controller.js";

export const emailRoutes = express.Router();

emailRoutes
  .get("/verify-email/:verificationToken", emailController.verify)
  .post("/send-verification-email", emailController.send);
