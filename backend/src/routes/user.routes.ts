import { Router } from 'express';
import { getAllUsers, recoverPassword, registerUser } from '../controllers/user.controller';

const router = Router();

router.get('/users', getAllUsers);

router.post('/recover-password', recoverPassword);
router.post('/register', registerUser);

export default router;
