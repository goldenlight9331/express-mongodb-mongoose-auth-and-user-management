import morgan from "morgan";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

import { logger, swaggerSpec } from "#config/index.js";
import { uploadDirectory } from "#constants/index.js";

const corsOptions = {
  origin: true,
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
const error_handler = async (err, req, res, next) => {
  const errorInfo = {
    status: err.statusCode || 500,
    message: err.message || "Something went wrong",
    stack: err.stack || "No stack trace available",
  };

  const error_response = {
    success: false,
    status: errorInfo.status,
    message: errorInfo.message,
    stack: errorInfo.stack,
  };

  logger.error(JSON.stringify(error_response, null, 2));
  res.status(errorInfo.status).json(error_response);
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
  app.use(error_handler);
};

export { applyGlobalMiddleware };
