import { Request, Response } from 'express';
import { AdModel } from '../models/AdModel';
import { cacheClient } from '../config/cacheClient';
import { fileUploader } from '../middlewares/fileUploader';
import { Op } from 'sequelize';

export class AdHandler {
    static async createAd(req: Request, res: Response) {
        fileUploader.array('images')(req, res, async (err) => {
            if (err) return res.status(400).json({ error: err.message });
            try {
                const { title, description, price, location, userId, categoryId } = req.body;
                const imagePaths = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];
                const newAd = await AdModel.create({
                    title,
                    description,
                    price,
                    location,
                    userId: parseInt(userId),
                    categoryId: parseInt(categoryId),
                    uploadedAt: new Date(),
                    isActive: false,
                    images: imagePaths
                });
                res.status(201).json(newAd);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });
    }

    static async fetchAds(req: Request, res: Response): Promise<any> {
        try {
            const cacheKey = 'ads:all';
            const cachedAds = await cacheClient.get(cacheKey);
            if (cachedAds) return res.status(200).json(JSON.parse(cachedAds));

            const ads = await AdModel.findAll();
            await cacheClient.setEx(cacheKey, 3600, JSON.stringify(ads));
            res.status(200).json(ads);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching ads', error });
        }
    }

    static async getAdById(req: Request, res: Response) {
        try {
            const ad = await AdModel.findByPk(req.params.id);
            ad ? res.json(ad) : res.status(404).json({ message: 'Ad not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching ad', error });
        }
    }

    static async updateAd(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { title, description, price, location, categoryId } = req.body;
            const ad = await AdModel.findByPk(id);
            if (!ad) return res.status(404).json({ message: 'Ad not found' });

            ad.title = title || ad.title;
            ad.description = description || ad.description;
            ad.price = price || ad.price;
            ad.location = location || ad.location;
            ad.categoryId = categoryId || ad.categoryId;

            await ad.save();
            res.json(ad);
        } catch (error) {
            res.status(500).json({ message: 'Error updating ad', error });
        }
    }

    static async deleteAd(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const ad = await AdModel.findByPk(id);
            if (!ad) return res.status(404).json({ message: 'Ad not found' });

            await ad.destroy();
            res.status(200).json({ message: 'Ad deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting ad', error });
        }
    }

    static async searchAds(req: Request, res: Response) {
        try {
            const { keyword, category, minPrice, maxPrice, location } = req.query;
            const filterCriteria: any = {};

            if (keyword) filterCriteria.title = { [Op.like]: `%${keyword}%` };
            if (category) filterCriteria.categoryId = category;
            if (minPrice) filterCriteria.price = { [Op.gte]: parseFloat(minPrice as string) };
            if (maxPrice) filterCriteria.price = { [Op.lte]: parseFloat(maxPrice as string) };
            if (location) filterCriteria.location = { [Op.like]: `%${location}%` };

            const ads = await AdModel.findAll({ where: filterCriteria });
            res.json(ads);
        } catch (error) {
            res.status(500).json({ message: 'Error searching ads', error });
        }
    }

    static async markAdAsSold(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const ad = await AdModel.findByPk(id);
            if (!ad) return res.status(404).json({ message: 'Ad not found' });

            ad.isSold = true;
            await ad.save();
            res.json({ message: 'Ad marked as sold' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating ad status', error });
        }
    }
}