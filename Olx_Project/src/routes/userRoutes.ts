import { Router } from 'express';
import { addUser, fetchUsers, getUserById, updateUser, removeUser } from '../controllers/UserController';
import { verifyAdminAccess } from '../middlewares/AuthMiddleware'; // Ensure path correctness

export const userRoutes = Router();

userRoutes.post('/', verifyAdminAccess, addUser);
userRoutes.get('/', fetchUsers);
userRoutes.get('/:id', getUserById);
userRoutes.put('/:id', verifyAdminAccess, updateUser);
userRoutes.delete('/:id', removeUser);
