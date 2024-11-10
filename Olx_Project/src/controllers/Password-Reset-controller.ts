import { Request, Response } from 'express';
import { PasswordResetService } from '../services/Password-Reset-service';
import { PasswordReset } from '../models/Password-Reset-model';

export class PasswordResetController {
    public static async requestPasswordReset(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { email } = req.body;

            await PasswordResetService.sendPasswordResetEmail(email);

            return res.status(200).json({
                message: 'Password reset email sent'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error sending password reset email',
                error
            });
        }
    }

    public static async resetPassword(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { token, newPassword } = req.body;

            await PasswordResetService.resetPassword(token, newPassword);

            return res.status(200).json({
                message: 'Password reset'
            });
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid or expired token',
                error
            });
        }
    }

    public static async create(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const passwordReset = await PasswordReset.create(req.body);

            return res.status(201).json(passwordReset);
        } catch (error) {
            return res.status(500).json({
                message: 'Error creating password reset',
                error
            });
        }
    }

    public static async getAll(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const passwordResets = await PasswordReset.findAll();

            return res.json(passwordResets);
        } catch (error) {
            return res.status(500).json({
                message: 'Error retrieving password resets',
                error
            });
        }
    }

    public static async getById(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const passwordReset = await PasswordReset.findByPk(req.params.id);

            if (!passwordReset) {
                return res.status(404).json({
                    message: 'Hash password not found'
                });
            }

            return res.json(passwordReset);
        } catch (error) {
            return res.status(500).json({
                message: 'Error retrieving password reset',
                error
            });
        }
    }

    public static async update(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const [updatedCount] = await PasswordReset.update(
                req.body,
                { where: { id: req.params.id } }
            );

            if (!updatedCount) {
                return res.status(404).json({
                    message: 'Hash password not found'
                });
            }

            const updatedPasswordReset = await PasswordReset.findByPk(req.params.id);
            return res.json(updatedPasswordReset);
        } catch (error) {
            return res.status(500).json({
                message: 'Error updating password reset',
                error
            });
        }
    }

    public static async delete(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const deletedCount = await PasswordReset.destroy({
                where: { id: req.params.id }
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: 'Hash password not found'
                });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                message: 'Error deleting password reset',
                error
            });
        }
    }
}