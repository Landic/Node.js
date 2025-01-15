import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UserModel } from '../models/UserModel';
import { PasswordResetTokenModel } from '../models/PasswordResetToken';

export class PasswordResetService {
    static async sendResetEmail(email: string) {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) throw new Error('User not found');

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await PasswordResetTokenModel.create({ userId: user.id, token, expiresAt });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Use the following link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
        };

        await transporter.sendMail(mailOptions);
    }

    static async resetPassword(token: string, newPassword: string) {
        const resetToken = await PasswordResetTokenModel.findOne({ where: { token } });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired token');
        }

        const user = await UserModel.findByPk(resetToken.userId);
        if (!user) throw new Error('User not found');

        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.save();
        await resetToken.destroy();
    }
}
