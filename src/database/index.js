import { mongoose } from "#packages/index.js";

import { logger } from "#utils/index.js";
import env from "#env/index.js";

let isConnected = false;

const { DATABASE_URI } = env;

const connectDatabase = async () => {
  if (isConnected) {
    logger.warn("Using existing MongoDB connection".yellow.bold);
    return;
  }

  try {
    const connection = await mongoose.connect(DATABASE_URI);

    isConnected = !!connection.connections[0].readyState;
    logger.info("Connected to MongoDB Database".green.bold);

    const db = mongoose.connection;

    db.on("error", (err) => {
      logger.error("MongoDB connection error:".red.bold, err.message);
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
    logger.error("Failed to connect to MongoDB:".red.bold, error.message);
    process.exit(1);
  }
};

export default connectDatabase;
