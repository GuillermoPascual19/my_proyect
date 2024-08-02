import { Router } from 'express';
import { getAllUsers, createUser, recoverPassword, registerUser } from '../controllers/user.controller';

const router = Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);

router.post('/recover-password', recoverPassword);
router.post('/register', registerUser);

export default router;
