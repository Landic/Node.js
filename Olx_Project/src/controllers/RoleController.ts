import { Request, Response } from 'express';
import { RoleModel } from '../models/RoleModel';
import { cacheClient } from '../config/cacheClient';

export class RoleHandler {
    static async createRole(req: Request, res: Response) {
        try {
            const newRole = await RoleModel.create(req.body);
            await cacheClient.del('roles:all');
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ message: 'Error creating role', error });
        }
    }

    static async fetchRoles(req: Request, res: Response): Promise<any> {
        try {
            const cacheKey = 'roles:all';
            const cachedRoles = await cacheClient.get(cacheKey);
            if (cachedRoles) return res.status(200).json(JSON.parse(cachedRoles));

            const roles = await RoleModel.findAll();
            await cacheClient.setEx(cacheKey, 3600, JSON.stringify(roles));
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching roles', error });
        }
    }

    static async getRoleById(req: Request, res: Response) {
        try {
            const role = await RoleModel.findByPk(req.params.id);
            role ? res.json(role) : res.status(404).json({ message: 'Role not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching role', error });
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const [updated] = await RoleModel.update(req.body, { where: { id: req.params.id } });
            updated ? res.json(await RoleModel.findByPk(req.params.id)) : res.status(404).json({ message: 'Role not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating role', error });
        }
    }

    static async deleteRole(req: Request, res: Response) {
        try {
            const deleted = await RoleModel.destroy({ where: { id: req.params.id } });
            deleted ? res.status(204).send() : res.status(404).json({ message: 'Role not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting role', error });
        }
    }
}