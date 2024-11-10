import { Router } from 'express';
import { AdvertisementController } from '../controllers/ad-controller';

export const advertisementRouter = Router();

advertisementRouter.post('/', AdvertisementController.create);
advertisementRouter.get('/', AdvertisementController.getAll);
advertisementRouter.get('/:id', AdvertisementController.getById);
advertisementRouter.put('/:id', AdvertisementController.update);
advertisementRouter.delete('/:id', AdvertisementController.delete);