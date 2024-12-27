import { express } from '#packages/index.js';
import { UsersController } from '#controllers/index.js';

export const usersRoutes = express.Router();

usersRoutes
  .get('/', UsersController.getAll)
  .get('/:userId', UsersController.getById)
  .put('/:userId', UsersController.updateById)
  .delete('/:userId', UsersController.deleteById);
