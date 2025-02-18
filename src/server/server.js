import { createServer } from "node:http";

import { connectDatabase } from "#config/index.js";
import { logger, env } from "#config/index.js";
import { asyncHandler } from "#utils/index.js";
import app from "./app.js";

const { PORT } = env;

const startServer = asyncHandler(async () => {
  await connectDatabase();
  const server = createServer(app);
  server.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
});

export { startServer };
