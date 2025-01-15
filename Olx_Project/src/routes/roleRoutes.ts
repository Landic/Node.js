import { Router } from 'express';
import { RoleHandler } from '../controllers/RoleController';

export const roleRoutes = Router();

roleRoutes.post('/', RoleHandler.createRole);
roleRoutes.get('/', RoleHandler.fetchRoles);
roleRoutes.get('/:id', RoleHandler.getRoleById);
roleRoutes.put('/:id', RoleHandler.updateRole);
roleRoutes.delete('/:id', RoleHandler.deleteRole);