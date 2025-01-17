import { Router } from 'express';
import { addUser, fetchUsers, getUserById, updateUser, removeUser } from '../controllers/UserController';
import { verifyAdminAccess } from '../middlewares/AuthMiddleware';
import { verifyToken } from '../middlewares/VerifyToken';

export const userRoutes = Router();

userRoutes.use(verifyToken);

userRoutes.post('/', verifyAdminAccess, addUser);
userRoutes.get('/', fetchUsers);
userRoutes.get('/:id', getUserById);
userRoutes.put('/:id', verifyAdminAccess, updateUser);
userRoutes.delete('/:id', removeUser);
