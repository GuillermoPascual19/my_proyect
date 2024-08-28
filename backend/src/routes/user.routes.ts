import { Router } from 'express';
import { getAllUsers, recoverPassword, registerUser, getUsersByRole, activateAccount, loginUser, changePassword } from '../controllers/user.controller';

const router = Router();

// Rutas para usuarios
router.get('/users', getAllUsers);
router.get('/roles', getUsersByRole);
router.post('/recover-password', recoverPassword);
router.post('/register', registerUser);
router.post('/activate-account', activateAccount);
router.post('/signin', loginUser);
router.post('/change-password', changePassword);

export default router;


//Apagar las pantallas perros