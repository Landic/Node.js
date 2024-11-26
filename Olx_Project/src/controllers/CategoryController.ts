import { Request, Response } from 'express';
import { Category } from '../models/CategoryModel';
import { redisClient } from '../config/Redis';

export class CategoryController {
    private static readonly CACHE_KEY = 'category:all';
    private static readonly CACHE_DURATION = 3600; // 1 hour in seconds

    public static async create(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const category = await Category.create(req.body);

            await this.invalidateCache();

            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating a category',
                error
            });
        }
    }

    public static async getAll(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const cachedCategories = await this.getCachedCategories();

            if (cachedCategories) {
                return res.status(200).json(cachedCategories);
            }

            const categories = await Category.findAll();

            await this.cacheCategories(categories);

            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when retrieving categories',
                error
            });
        }
    }

    public static async getById(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const category = await Category.findByPk(req.params.id);

            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            return res.json(category);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when retrieving category',
                error
            });
        }
    }

    public static async update(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const [updatedCount] = await Category.update(
                req.body,
                { where: { id: req.params.id } }
            );

            if (!updatedCount) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            const updatedCategory = await Category.findByPk(req.params.id);
            await this.invalidateCache();

            return res.json(updatedCategory);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when updating category',
                error
            });
        }
    }

    public static async delete(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const deletedCount = await Category.destroy({
                where: { id: req.params.id }
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            await this.invalidateCache();

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                message: 'Error when deleting category',
                error
            });
        }
    }

    private static async getCachedCategories(): Promise<any | null> {
        const cachedData = await redisClient.get(this.CACHE_KEY);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    private static async cacheCategories(categories: any[]): Promise<void> {
        await redisClient.setEx(
            this.CACHE_KEY,
            this.CACHE_DURATION,
            JSON.stringify(categories)
        );
    }

    private static async invalidateCache(): Promise<void> {
        await redisClient.del(this.CACHE_KEY);
    }
}