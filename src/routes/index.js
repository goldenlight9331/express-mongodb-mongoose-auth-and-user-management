import express from "express";

import {
  authRoutes,
  userRoutes,
  emailRoutes,
  otpRoutes,
} from "#modules/index.js";
import { verifyAuthToken } from "#middleware/index.js";

const rootRouter = express.Router();
const v1Router = express.Router();

rootRouter.get("/", (_, res) => {
  res.json({ message: "Server is working..." });
});

rootRouter.use("/api/v1", v1Router);

v1Router.use(authRoutes, emailRoutes);
v1Router.use("/users", verifyAuthToken, userRoutes);
v1Router.use("/otp", otpRoutes);

export default rootRouter;
