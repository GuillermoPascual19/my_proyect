import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controller';

const router = Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);

export default router;
