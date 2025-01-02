import { express } from '#packages/index.js';
import { listenServer } from '#server/index.js';
import { connectDatabase, configureRoutes } from '#config/index.js';
import { implementMiddlewares } from '#middlewares/index.js';

const app = express();
export const io = listenServer(app);

connectDatabase();
implementMiddlewares(app);
configureRoutes(app);

export default app;
