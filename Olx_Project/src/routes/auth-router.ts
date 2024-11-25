import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { PasswordResetController } from '../controllers/Password-Reset-controller';

// Обертка для асинхронных функций
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const authRouter = Router();

authRouter.post('/register', asyncHandler(AuthController.register));
authRouter.post('/login', asyncHandler(AuthController.login));
authRouter.post(
    '/request-password-reset',
    asyncHandler(PasswordResetController.requestPasswordReset)
);
authRouter.post(
    '/reset-password',
    asyncHandler(PasswordResetController.resetPassword)
);
authRouter.post('/', asyncHandler(PasswordResetController.create));
authRouter.get('/', asyncHandler(PasswordResetController.getAll));
authRouter.get('/:id', asyncHandler(PasswordResetController.getById));
authRouter.put('/:id', asyncHandler(PasswordResetController.update));
authRouter.delete('/:id', asyncHandler(PasswordResetController.delete));
