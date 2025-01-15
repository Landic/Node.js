import { Router } from 'express';
import { MessageHandler } from '../controllers/MessageController';

export const messageRoutes = Router();

messageRoutes.post('/', MessageHandler.createMessage);
messageRoutes.get('/', MessageHandler.fetchMessages);
messageRoutes.get('/:id', MessageHandler.getMessageById);
messageRoutes.put('/:id', MessageHandler.updateMessage);
messageRoutes.delete('/:id', MessageHandler.deleteMessage);