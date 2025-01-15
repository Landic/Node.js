import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel';
import { RoleModel } from '../models/RoleModel';

export const verifyAdminAccess = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized access' });
    try {
        const user = await UserModel.findByPk(userId);
        const role = await RoleModel.findByPk(user?.roleId);

        if (!user || role?.name !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user role', error });
    }
};
