import { Router } from 'express';
import { getAllUsers, recoverPassword, registerUser, getUsersByRole, activateAccount } from '../controllers/user.controller';

const router = Router();

// Rutas para usuarios
router.get('/users', getAllUsers);
router.get('/roles', getUsersByRole);
router.post('/recover-password', recoverPassword);
router.post('/register', registerUser);
router.post('/activate-account', activateAccount);

export default router;
