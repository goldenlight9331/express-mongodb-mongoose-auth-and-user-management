import { createServer } from '#packages/index.js';
import { dotEnv, logger } from '#utils/index.js';

const { PORT } = dotEnv;

export const serverListener = app => {
  const server = createServer(app);

  server.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.cyan.bold);
  });
};
