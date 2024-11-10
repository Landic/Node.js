import { Request, Response } from 'express';
import { Message } from '../models/message-model';
import { redisClient } from '../config/redis';

export class MessageController {
    private static readonly CACHE_KEY = 'message:all';
    private static readonly CACHE_DURATION = 3600; // 1 hour in seconds

    public static async create(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const message = await Message.create(req.body);

            await this.invalidateCache();

            return res.status(201).json(message);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating a message',
                error
            });
        }
    }

    public static async getAll(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const cachedMessages = await this.getCachedMessages();

            if (cachedMessages) {
                return res.status(200).json(cachedMessages);
            }

            const messages = await Message.findAll();

            await this.cacheMessages(messages);

            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when receiving messages',
                error
            });
        }
    }

    public static async getById(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const message = await Message.findByPk(req.params.id);

            if (!message) {
                return res.status(404).json({
                    message: 'Message not found'
                });
            }

            return res.json(message);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when retrieving message',
                error
            });
        }
    }

    public static async update(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const [updatedCount] = await Message.update(
                req.body,
                { where: { id: req.params.id } }
            );

            if (!updatedCount) {
                return res.status(404).json({
                    message: 'Message not found'
                });
            }

            const updatedMessage = await Message.findByPk(req.params.id);
            await this.invalidateCache();

            return res.json(updatedMessage);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when updating message',
                error
            });
        }
    }

    public static async delete(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const deletedCount = await Message.destroy({
                where: { id: req.params.id }
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: 'Message not found'
                });
            }

            await this.invalidateCache();

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                message: 'Error when deleting message',
                error
            });
        }
    }

    private static async getCachedMessages(): Promise<any | null> {
        const cachedData = await redisClient.get(this.CACHE_KEY);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    private static async cacheMessages(messages: any[]): Promise<void> {
        await redisClient.setEx(
            this.CACHE_KEY,
            this.CACHE_DURATION,
            JSON.stringify(messages)
        );
    }

    private static async invalidateCache(): Promise<void> {
        await redisClient.del(this.CACHE_KEY);
    }
}