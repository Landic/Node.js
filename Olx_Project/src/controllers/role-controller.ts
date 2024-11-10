import { Request, Response } from 'express';
import { Role } from '../models/role-model';
import { redisClient } from '../config/redis';

export class RoleController {
    private static readonly CACHE_KEY = 'role:all';
    private static readonly CACHE_DURATION = 3600; // 1 hour in seconds

    public static async create(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const role = await Role.create(req.body);

            await this.invalidateCache();

            return res.status(201).json(role);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating a role',
                error
            });
        }
    }

    public static async getAll(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const cachedRoles = await this.getCachedRoles();

            if (cachedRoles) {
                return res.status(200).json(cachedRoles);
            }

            const roles = await Role.findAll();

            await this.cacheRoles(roles);

            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when obtaining roles',
                error
            });
        }
    }

    public static async getById(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const role = await Role.findByPk(req.params.id);

            if (!role) {
                return res.status(404).json({
                    message: 'Role not found'
                });
            }

            return res.json(role);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when retrieving role',
                error
            });
        }
    }

    public static async update(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const [updatedCount] = await Role.update(
                req.body,
                { where: { id: req.params.id } }
            );

            if (!updatedCount) {
                return res.status(404).json({
                    message: 'Role not found'
                });
            }

            const updatedRole = await Role.findByPk(req.params.id);
            await this.invalidateCache();

            return res.json(updatedRole);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when updating role',
                error
            });
        }
    }

    public static async delete(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const deletedCount = await Role.destroy({
                where: { id: req.params.id }
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: 'Role not found'
                });
            }

            await this.invalidateCache();

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                message: 'Error when deleting role',
                error
            });
        }
    }

    private static async getCachedRoles(): Promise<any | null> {
        const cachedData = await redisClient.get(this.CACHE_KEY);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    private static async cacheRoles(roles: any[]): Promise<void> {
        await redisClient.setEx(
            this.CACHE_KEY,
            this.CACHE_DURATION,
            JSON.stringify(roles)
        );
    }

    private static async invalidateCache(): Promise<void> {
        await redisClient.del(this.CACHE_KEY);
    }
}