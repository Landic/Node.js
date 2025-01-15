import { Router } from 'express';
import { AdHandler } from '../controllers/AdController';
import { verifyAdminAccess } from '../middlewares/AuthMiddleware';

export const adRoutes = Router();

adRoutes.post('/', verifyAdminAccess, AdHandler.createAd);
adRoutes.get('/', AdHandler.fetchAds);
adRoutes.get('/:id', AdHandler.getAdById);
adRoutes.put('/:id', verifyAdminAccess, AdHandler.updateAd);
adRoutes.delete('/:id', AdHandler.deleteAd);
adRoutes.get('/search', AdHandler.searchAds);
adRoutes.patch('/:id/sold', AdHandler.markAdAsSold);