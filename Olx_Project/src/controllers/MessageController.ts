import { Request, Response } from 'express';
import { MessageModel } from '../models/MessageModel';
import { cacheClient } from '../config/cacheClient';

export class MessageHandler {
    static async createMessage(req: Request, res: Response): Promise<any> {
        try {
            const { senderId, receiverId, content } = req.body;
            if (!senderId || !receiverId || !content) {
                return res.status(400).json({ message: 'All fields (senderId, receiverId, content) are required.' });
            }

            const newMessage = await MessageModel.create(req.body);
            await cacheClient.del('messages:all');
            res.status(201).json(newMessage);
        } catch (error) {
            res.status(500).json({ message: 'Error creating message', error });
        }
    }

    static async fetchMessages(req: Request, res: Response): Promise<any> {
        try {
            const cacheKey = 'messages:all';
            const cachedMessages = await cacheClient.get(cacheKey);
            if (cachedMessages) return res.status(200).json(JSON.parse(cachedMessages));

            const messages = await MessageModel.findAll();
            await cacheClient.setEx(cacheKey, 3600, JSON.stringify(messages));
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching messages', error });
        }
    }

    static async getMessageById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const cacheKey = `message:${id}`;
            const cachedMessage = await cacheClient.get(cacheKey);

            if (cachedMessage) return res.status(200).json(JSON.parse(cachedMessage));
            const message = await MessageModel.findByPk(id);
            if (!message) return res.status(404).json({ message: 'Message not found' });

            await cacheClient.setEx(cacheKey, 3600, JSON.stringify(message));
            res.json(message);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching message', error });
        }
    }

    static async updateMessage(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const [updated] = await MessageModel.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Message not found' });

            const updatedMessage = await MessageModel.findByPk(id);
            await cacheClient.del('messages:all');
            await cacheClient.del(`message:${id}`);
            res.json(updatedMessage);
        } catch (error) {
            res.status(500).json({ message: 'Error updating message', error });
        }
    }

    static async deleteMessage(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const deleted = await MessageModel.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Message not found' });

            await cacheClient.del('messages:all');
            await cacheClient.del(`message:${id}`);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting message', error });
        }
    }
}
