import express from "express";

import otpController from "./otp.controller.js";

export const otpRoutes = express.Router();

otpRoutes
  .post("/send", otpController.send)
  .post("/verify", otpController.verify);
