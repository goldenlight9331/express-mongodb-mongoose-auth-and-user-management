import { mongoose } from '#packages/index.js';
import { dotEnv, logger } from '#utils/index.js';

let isConnected = false;

export const connectDatabase = async () => {
  const { MONGO_URI } = dotEnv;
  if (isConnected) {
    console.info('Using existing MongoDB connection'.magenta.bold);
    return;
  }

  try {
    const connection = await mongoose.connect(MONGO_URI);

    isConnected = !!connection.connections[0].readyState;
    logger.info('Connected to MongoDB Database'.magenta.bold);

    const db = mongoose.connection;

    db.on('error', err => {
      logger.error('MongoDB connection error:'.red.bold, err.message);
    });

    db.on('disconnected', () => {
      logger.warn('MongoDB disconnected'.red.bold);
      isConnected = false;
    });

    process.on('SIGINT', async () => {
      await db.close();
      logger.info('MongoDB connection closed'.red.bold);
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:'.red.bold, error.message);
    process.exit(1);
  }
};
