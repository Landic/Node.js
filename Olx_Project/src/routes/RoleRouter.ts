import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';

// Обертка для обработки асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const roleRouter = Router();

roleRouter.post('/', asyncHandler(RoleController.create));
roleRouter.get('/', asyncHandler(RoleController.getAll));
roleRouter.get('/:id', asyncHandler(RoleController.getById));
roleRouter.put('/:id', asyncHandler(RoleController.update));
roleRouter.delete('/:id', asyncHandler(RoleController.delete));
