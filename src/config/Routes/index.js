import { express } from '#packages/index.js';
import { validate } from '#middlewares/index.js';
import { authRoutes, usersRoutes } from '#routes/index.js';

const rootRouter = express.Router();
const v1Router = express.Router();

rootRouter.get('/', (_, res) => {
  res.json({ message: 'Server is active...' });
});

rootRouter.use('/api/v1', v1Router);

v1Router.use('/auth', authRoutes);
v1Router.use(
  '/users',
  validate.authToken,
  validate.authRole('admin'),
  usersRoutes,
);

v1Router.use('*', (_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export const configureRoutes = app => {
  app.use(rootRouter);
};
