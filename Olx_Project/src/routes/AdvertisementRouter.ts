import { Router } from 'express';
import { AdvertisementController } from '../controllers/AdvertisementController';

export const advertisementRouter = Router();

// Обертка для асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

advertisementRouter.post('/', asyncHandler(AdvertisementController.create));
advertisementRouter.get('/', asyncHandler(AdvertisementController.getAll));
advertisementRouter.get('/:id', asyncHandler(AdvertisementController.getById));
advertisementRouter.put('/:id', asyncHandler(AdvertisementController.update));
advertisementRouter.delete('/:id', asyncHandler(AdvertisementController.delete));
