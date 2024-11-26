import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User } from '../models/UserModel';
import { PasswordResetToken } from '../models/PasswordResetToken';

export class PasswordResetService {
    static async sendPasswordResetEmail(email: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User not found');

        const token = crypto.randomBytes(32).toString('hex'), expiryDate = new Date(Date.now() + 60 * 60 * 1000);
        await PasswordResetToken.create({ userId: user.id, token, expiryDate });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password reset request',
            text: `Use the following link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
        };
        await transporter.sendMail(mailOptions);
    }

    static async resetPassword(token: string, newPassword: string) {
        const resetToken = await PasswordResetToken.findOne({ where: { token } });
        if (!resetToken || resetToken.expiryDate < new Date()) throw new Error('Token is expired or invalid');
        const user = await User.findByPk(resetToken.userId);
        if (!user) throw new Error('User not found');
    
        user.hash_pass = await bcrypt.hash(newPassword, 10);
        await user.save();
        await resetToken.destroy();
    }
}