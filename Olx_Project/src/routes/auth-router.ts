import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { PasswordResetController } from '../controllers/Password-Reset-controller';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/request-password-reset', PasswordResetController.requestPasswordReset);
authRouter.post('/reset-password', PasswordResetController.resetPassword);
authRouter.post('/', PasswordResetController.create);
authRouter.get('/', PasswordResetController.getAll);
authRouter.get('/:id', PasswordResetController.getById);
authRouter.put('/:id', PasswordResetController.update);
authRouter.delete('/:id', PasswordResetController.delete);