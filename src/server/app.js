import express from "express";

import { applyGlobalMiddleware } from "#middleware/index.js";
import rootRouter from "#routes/index.js";

const app = express();
applyGlobalMiddleware(app, rootRouter);

export default app;
