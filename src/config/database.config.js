import mongoose from "mongoose";

import { logger } from "./index.js";
import { env } from "./env.config.js";

let isConnected = false;

const { DATABASE_URI } = env;

export const connectDatabase = async () => {
  if (isConnected) {
    logger.warn("Using existing MongoDB connection".yellow.bold);
    return;
  }

  try {
    const connection = await mongoose.connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = !!connection.connections[0].readyState;
    logger.info("Connected to MongoDB Database".gray);

    const db = mongoose.connection;

    db.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    db.on("disconnected", () => {
      logger.error("MongoDB disconnected".red.bold);
      isConnected = false;
    });

    process.on("SIGINT", async () => {
      await db.close();
      logger.info("MongoDB connection closed".red.bold);
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
