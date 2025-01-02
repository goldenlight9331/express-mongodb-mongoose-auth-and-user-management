import { express } from '#packages/index.js';
import { UsersController } from '#controllers/index.js';
import { validate } from '#middlewares/index.js';

export const usersRoutes = express.Router();

usersRoutes
  .get(
    '/get-all',
    validate.authToken,
    validate.authRoles('admin'),
    UsersController.getAll,
  )
  .get(
    '/get-by-id/:userId',
    validate.authToken,
    validate.authRoles('admin'),
    UsersController.getById,
  )
  .put(
    '/update-by-id/:userId',
    validate.authToken,
    validate.authRoles('admin'),
    UsersController.updateById,
  )
  .delete(
    '/delete-by-id/:userId',
    validate.authToken,
    validate.authRoles('admin'),
    UsersController.deleteById,
  );
