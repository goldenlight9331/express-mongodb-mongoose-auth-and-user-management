import env from "#env/index.js";
import utility from "#utility/index.js";

const { PORT } = env;
const { logger } = utility;

const listenServer = (app) => {
  app.listen(PORT || 5000, () => {
    logger.info(
      `The server is accessible at http://localhost:${PORT}`.white.bold,
    );
  });
};

export default listenServer;
