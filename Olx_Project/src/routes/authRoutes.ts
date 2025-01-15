import { Router } from 'express';
import { AuthHandler } from '../controllers/AuthController';
import { PasswordResetHandler } from '../controllers/PasswordResetController';

export const authRoutes = Router();

authRoutes.post('/register', AuthHandler.registerUser);
authRoutes.post('/login', AuthHandler.loginUser);
authRoutes.post('/request-password-reset', PasswordResetHandler.requestPasswordReset);
authRoutes.post('/reset-password', PasswordResetHandler.resetPassword);
authRoutes.post('/', PasswordResetHandler.createPasswordReset);
authRoutes.get('/', PasswordResetHandler.fetchAllPasswordResets);
authRoutes.get('/:id', PasswordResetHandler.getPasswordResetById);
authRoutes.put('/:id', PasswordResetHandler.updatePasswordReset);
authRoutes.delete('/:id', PasswordResetHandler.deletePasswordReset);