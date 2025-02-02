import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
        (req as any).userId = decoded.userId; // Добавляем userId в объект запроса
        next(); // Обязательно вызываем next() для продолжения
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token', error });
    }
};
