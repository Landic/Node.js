import { Request, Response } from 'express';
import { Advertisement } from '../models/ad-model';
import { redisClient } from '../config/redis';

export class AdvertisementController {
    private static readonly CACHE_KEY = 'ads:all';
    private static readonly CACHE_DURATION = 3600; // 1 hour in seconds

    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const advertisement = await Advertisement.create(req.body);
            await redisClient.del(this.CACHE_KEY);

            return res.status(201).json({
                success: true,
                data: advertisement,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error creating advertisement',
                error,
            });
        }
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            // Check cache first
            const cachedAds = await redisClient.get(this.CACHE_KEY);
            if (cachedAds) {
                return res.status(200).json({
                    success: true,
                    data: JSON.parse(cachedAds),
                    source: 'cache',
                });
            }

            // Get from database
            const ads = await Advertisement.findAll();
            await redisClient.setEx(
                this.CACHE_KEY,
                this.CACHE_DURATION,
                JSON.stringify(ads),
            );

            return res.status(200).json({
                success: true,
                data: ads,
                source: 'database',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving advertisements',
                error,
            });
        }
    }

    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const advertisement = await Advertisement.findByPk(id);

            if (!advertisement) {
                return res.status(404).json({
                    success: false,
                    message: 'Advertisement not found',
                });
            }

            return res.status(200).json({
                success: true,
                data: advertisement,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving advertisement',
                error,
            });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const [updatedCount] = await Advertisement.update(req.body, {
                where: { id },
            });

            if (!updatedCount) {
                return res.status(404).json({
                    success: false,
                    message: 'Advertisement not found',
                });
            }

            const updatedAd = await Advertisement.findByPk(id);
            await redisClient.del(this.CACHE_KEY);

            return res.status(200).json({
                success: true,
                data: updatedAd,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error updating advertisement',
                error,
            });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const deletedCount = await Advertisement.destroy({
                where: { id },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    success: false,
                    message: 'Advertisement not found',
                });
            }

            await redisClient.del(this.CACHE_KEY);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting advertisement',
                error,
            });
        }
    }
}
