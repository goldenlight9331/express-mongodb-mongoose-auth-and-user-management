import { createServer } from '#packages/index.js';
import { logger, dotEnv } from '#utils/index.js';

const { PORT } = dotEnv;

const listenServer = app => {
  const server = createServer(app);

  server.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.cyan.bold);
  });
};

export default listenServer;
