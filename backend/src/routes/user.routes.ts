import { Router } from 'express';
import { getAllUsers, createUser, recoverPassword } from '../controllers/user.controller';

const router = Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);

router.post('/recover-password', recoverPassword);

/*router.post(
    "/register", checkValidEmail,
);
*/
export default router;
