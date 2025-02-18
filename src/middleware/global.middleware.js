import morgan from "morgan";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

import { logger, env, swaggerSpec } from "#config/index.js";
import { uploadDirectory } from "#constants/index.js";

const { NODE_ENV } = env;

const corsOptions = {
  origin: true,
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  const errorResponse = {
    success: false,
    status,
    message,
    stack: NODE_ENV === "development" ? err.stack : undefined,
  };

  logger.error(JSON.stringify(errorResponse, null, 2));
  res.status(status).json(errorResponse);
};

const invalidRouteHandler = (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
};

const applyGlobalMiddleware = (app, rootRouter) => {
  app.use(morgan("dev"));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(uploadDirectory));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(rootRouter);
  app.use(invalidRouteHandler);
  app.use(errorHandler);
};

export { applyGlobalMiddleware };
