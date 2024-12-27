import { createServer } from '#packages/index.js';
import { logger } from '#utils/index.js';
import { dotEnv } from '#dotenv/index.js';

const { PORT } = dotEnv;

export const serverListener = app => {
  const server = createServer(app);

  server.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.cyan.bold);
  });
};
