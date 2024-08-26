import { Router } from 'express';
import { getAllUsers, recoverPassword, registerUser, getUsersByRole, activateAccount, loginUser } from '../controllers/user.controller';

const router = Router();

// Rutas para usuarios
router.get('/users', getAllUsers);
router.get('/roles', getUsersByRole);
router.post('/recover-password', recoverPassword);
router.post('/register', registerUser);
router.post('/activate-account', activateAccount);
router.post('/signin', loginUser);

export default router;
