import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/user-controller';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);