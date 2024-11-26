import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

// Обертка для обработки асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const messageRouter = Router();

messageRouter.post('/', asyncHandler(MessageController.create));
messageRouter.get('/', asyncHandler(MessageController.getAll));
messageRouter.get('/:id', asyncHandler(MessageController.getById));
messageRouter.put('/:id', asyncHandler(MessageController.update));
messageRouter.delete('/:id', asyncHandler(MessageController.delete));
