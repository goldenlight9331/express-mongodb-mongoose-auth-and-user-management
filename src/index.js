import { express } from '#packages/index.js';
import { listenServer } from '#server/index.js';
import { connectDatabase, configureRoutes } from '#config/index.js';
import { setupMiddlewares } from '#middlewares/index.js';

const app = express();

connectDatabase();
setupMiddlewares(app);
configureRoutes(app);
listenServer(app);

export default app;
