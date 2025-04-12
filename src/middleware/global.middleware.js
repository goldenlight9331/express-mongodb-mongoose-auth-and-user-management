import morgan from "morgan";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

import { logger, env, swaggerSpec, promptAI } from "#config/index.js";
import { uploadDirectory } from "#constants/index.js";

const { NODE_ENV } = env;

const corsOptions = {
  origin: true,
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
const error_handler = async (err, req, res, next) => {
  const is_development = NODE_ENV === "development";

  // Core error properties
  const errorInfo = {
    status: err.statusCode || 500,
    message: err.message || "Something went wrong",
    stack: err.stack || "No stack trace available",
    name: err.name || "UnknownError",
    errors: err.errors,
    fileName: err.fileName,
    lineNumber: err.lineNumber,
    columnNumber: err.columnNumber,
    cause: err.cause ? err.cause.message || String(err.cause) : undefined,
  };

  // Extract additional properties not already captured
  const excludedKeys = [
    "name",
    "message",
    "stack",
    "statusCode",
    "cause",
    "errors",
    "fileName",
    "lineNumber",
    "columnNumber",
  ];
  const additionalInfo = Object.fromEntries(
    Object.entries(err).filter(([key]) => !excludedKeys.includes(key)),
  );

  // Construct AI prompt with all available error information
  const aiPromptParts = [
    "Analyze this error and provide the root cause, technical impact, specific code fix, and debugging steps.",
    "Be precise and actionable. Respond in a single line without text formatting (bolding, italicizing, etc).",
    `Error: ${errorInfo.message}`,
    `Stack: ${errorInfo.stack}`,
    `Status: ${errorInfo.status}`,
    `Name: ${errorInfo.name}`,
  ];

  // Add optional fields only if they exist
  if (errorInfo.errors)
    aiPromptParts.push(`Errors: ${JSON.stringify(errorInfo.errors)}`);
  if (errorInfo.fileName) aiPromptParts.push(`File: ${errorInfo.fileName}`);
  if (errorInfo.lineNumber) aiPromptParts.push(`Line: ${errorInfo.lineNumber}`);
  if (errorInfo.columnNumber)
    aiPromptParts.push(`Column: ${errorInfo.columnNumber}`);
  if (errorInfo.cause) aiPromptParts.push(`Cause: ${errorInfo.cause}`);
  if (Object.keys(additionalInfo).length > 0)
    aiPromptParts.push(`Additional Info: ${JSON.stringify(additionalInfo)}`);

  // Get AI response only in development mode
  const ai_response = is_development
    ? await promptAI(aiPromptParts.join("\n"))
    : undefined;

  // Construct response object
  const error_response = {
    success: false,
    status: errorInfo.status,
    message: errorInfo.message,
    ...(is_development && {
      stack: errorInfo.stack,
      name: errorInfo.name,
      code: errorInfo.code,
      fix: ai_response,
      ...(Object.keys(additionalInfo).length > 0 && { additionalInfo }),
    }),
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
