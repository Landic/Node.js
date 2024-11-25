import { Router } from 'express';
import { CategoryController } from '../controllers/category-controller';

// Обертка для асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const categoryRouter = Router();

categoryRouter.post('/', asyncHandler(CategoryController.create));
categoryRouter.get('/', asyncHandler(CategoryController.getAll));
categoryRouter.get('/:id', asyncHandler(CategoryController.getById));
categoryRouter.put('/:id', asyncHandler(CategoryController.update));
categoryRouter.delete('/:id', asyncHandler(CategoryController.delete));
