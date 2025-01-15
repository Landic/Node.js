import { Router } from 'express';
import { CategoryHandler } from '../controllers/CategoryController';

export const categoryRoutes = Router();

categoryRoutes.post('/', CategoryHandler.createCategory);
categoryRoutes.get('/', CategoryHandler.fetchCategories);
categoryRoutes.get('/:id', CategoryHandler.getCategoryById);
categoryRoutes.put('/:id', CategoryHandler.updateCategory);
categoryRoutes.delete('/:id', CategoryHandler.deleteCategory);