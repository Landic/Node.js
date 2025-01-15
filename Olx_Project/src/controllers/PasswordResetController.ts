import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { PasswordResetService } from '../services/PasswordResetService';
import { PasswordResetModel } from '../models/PasswordResetModel';

export class PasswordResetHandler {
    static async requestPasswordReset(req: Request, res: Response): Promise<any> {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: 'User with the specified email not found' });
            await PasswordResetService.sendResetEmail(email);
            return res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            return res.status(500).json({ message: 'Error sending password reset email', error });
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<any> {
        const { token, newPassword } = req.body;
        try {
            const passwordResetRecord = await PasswordResetModel.findOne({ where: { token } });
            if (!passwordResetRecord || new Date(passwordResetRecord.expiresAt) < new Date()) {
                throw new Error('Invalid or expired token');
            }
            await PasswordResetService.resetPassword(token, newPassword);
            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            return res.status(400).json({ message: 'Invalid or expired token', error });
        }
    }

    static async createPasswordReset(req: Request, res: Response) {
        try {
            const newPasswordReset = await PasswordResetModel.create(req.body);
            res.status(201).json(newPasswordReset);
        } catch (error) {
            res.status(500).json({ message: 'Error creating password reset record', error });
        }
    }

    static async fetchAllPasswordResets(req: Request, res: Response) {
        try {
            const passwordResets = await PasswordResetModel.findAll();
            res.json(passwordResets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching password resets', error });
        }
    }

    static async getPasswordResetById(req: Request, res: Response) {
        try {
            const passwordResetRecord = await PasswordResetModel.findByPk(req.params.id);
            passwordResetRecord
                ? res.json(passwordResetRecord)
                : res.status(404).json({ message: 'Password reset record not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching password reset record', error });
        }
    }

    static async updatePasswordReset(req: Request, res: Response) {
        try {
            const [updated] = await PasswordResetModel.update(req.body, { where: { id: req.params.id } });
            updated
                ? res.json(await PasswordResetModel.findByPk(req.params.id))
                : res.status(404).json({ message: 'Password reset record not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password reset record', error });
        }
    }

    static async deletePasswordReset(req: Request, res: Response) {
        try {
            const deleted = await PasswordResetModel.destroy({ where: { id: req.params.id } });
            deleted
                ? res.status(204).send()
                : res.status(404).json({ message: 'Password reset record not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting password reset record', error });
        }
    }
}
