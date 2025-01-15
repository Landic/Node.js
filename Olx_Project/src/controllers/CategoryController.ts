import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';
import { cacheClient } from '../config/cacheClient';

export class CategoryHandler {
    static async createCategory(req: Request, res: Response) {
        try {
            const newCategory = await CategoryModel.create(req.body);
            await cacheClient.del('categories:all');
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error creating category', error });
        }
    }

    static async fetchCategories(req: Request, res: Response): Promise<any> {
        try {
            const cacheKey = 'categories:all';
            const cachedCategories = await cacheClient.get(cacheKey);
            if (cachedCategories) return res.status(200).json(JSON.parse(cachedCategories));

            const categories = await CategoryModel.findAll();
            await cacheClient.setEx(cacheKey, 3600, JSON.stringify(categories));
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categories', error });
        }
    }

    static async getCategoryById(req: Request, res: Response) {
        try {
            const category = await CategoryModel.findByPk(+req.params.id);
            category ? res.json(category) : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching category', error });
        }
    }

    static async updateCategory(req: Request, res: Response) {
        try {
            const [updated] = await CategoryModel.update(req.body, { where: { id: +req.params.id } });
            await cacheClient.del('categories:all');
            updated ? res.json(await CategoryModel.findByPk(+req.params.id)) : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating category', error });
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const deleted = await CategoryModel.destroy({ where: { id: +req.params.id } });
            await cacheClient.del('categories:all');
            deleted ? res.status(204).send() : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting category', error });
        }
    }
}
