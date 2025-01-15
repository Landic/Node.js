import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { RoleModel } from '../models/RoleModel';
import { cacheClient } from '../config/cacheClient';

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleId, email, hashedPassword, name, avatar } = req.body;
        const newUser = await UserModel.create({
            roleId,
            email,
            hashedPassword,
            name,
            avatar,
            createdAt: new Date(),
            lastActive: new Date(),
            isActive: true
        });
        await cacheClient.del('users:all');
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const fetchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.findAll();

        if (users.length > 0) res.status(200).json(users);
        else res.status(404).json({ message: 'No users found' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findByPk(userId, { include: [RoleModel] });

        user ? res.status(200).json(user) : res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { roleId, email, name, avatar, isActive } = req.body;
        const user = await UserModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.roleId = roleId || user.roleId;
        user.email = email || user.email;
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.isActive = isActive !== undefined ? isActive : user.isActive;
        user.lastActive = new Date();

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const removeUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findByPk(req.params.id);

        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted' });
        } else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
