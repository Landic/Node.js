import { Router } from 'express';
import { UserController } from '../controllers/UserController';

// Обертка для обработки асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const userRouter = Router();

userRouter.post('/', asyncHandler(UserController.createUser));
userRouter.get('/:id', asyncHandler(UserController.getUser));
userRouter.put('/:id', asyncHandler(UserController.updateUser));
userRouter.delete('/:id', asyncHandler(UserController.deleteUser));
