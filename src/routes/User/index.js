import { express } from '#packages/index.js';
import { UsersController } from '#controllers/index.js';

const usersRoutes = express.Router();

usersRoutes
  .get('/get-all', UsersController.getAll)
  .get('/get-by-id/:userId', UsersController.getById)
  .put('/update-by-id/:userId', UsersController.updateById)
  .delete('/delete-by-id/:userId', UsersController.deleteById);

export default usersRoutes;