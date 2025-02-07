import utilities from "#utilities/index.js";
import env from "#env/index.js";

const { logger } = utilities;
const { PORT } = env;

const startServer = (app) => {
  app.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.white.bold);
  });
};

export default startServer;
