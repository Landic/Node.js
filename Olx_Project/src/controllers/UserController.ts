import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { Role } from '../models/RoleModel';
import { redisClient } from '../config/Redis';

export class UserController {
    private static readonly CACHE_KEY = 'user:all';

    public static async createUser(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { role_id, email, hash_pass, name, avatar } = req.body;
            const newUser = await User.create({
                role_id,
                email,
                hash_pass,
                name,
                avatar,
                created_date: new Date(),
                last_activity: new Date(),
                status: true
            });

            await redisClient.del(this.CACHE_KEY);

            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating a user',
                error
            });
        }
    }

    public static async getUser(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const user = await User.findByPk(req.params.id, { include: [Role] });

            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error when retrieving a user',
                error
            });
        }
    }

    public static async updateUser(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { role_id, email, name, avatar, status } = req.body;
            const user = await User.findByPk(req.params.id);

            if (user) {
                user.role_id = role_id || user.role_id;
                user.email = email || user.email;
                user.name = name || user.name;
                user.avatar = avatar || user.avatar;
                user.status = status !== undefined ? status : user.status;
                user.last_activity = new Date();

                await user.save();

                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error during user update',
                error
            });
        }
    }

    public static async deleteUser(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const user = await User.findByPk(req.params.id);

            if (user) {
                await user.destroy();

                return res.status(200).json({ message: 'User Deleted' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error when deleting a user',
                error
            });
        }
    }
}
