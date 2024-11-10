import { Request, Response, NextFunction } from "express";
import { User } from "../models/user-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class AuthController {
    private static readonly SALT_ROUNDS = 10;
    private static readonly TOKEN_EXPIRATION = "1h";

    public static async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const { email, password, name } = req.body;

            const existingUser = await User.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "A user with this email address already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(
                password,
                this.SALT_ROUNDS
            );

            const currentDate = new Date();
            const user = await User.create({
                email,
                hash_pass: hashedPassword,
                name,
                created_date: currentDate,
                last_activity: currentDate,
            });

            return res.status(201).json({
                message: "User successfully registered",
                user
            });
        } catch (error) {
            next(error);
        }
    }

    public static async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                where: { email }
            });

            if (!user || !(await this.verifyPassword(password, user.hash_pass))) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            const token = this.generateToken(user.user_id, user.email);

            return res.json({
                message: "Successful authentication",
                token
            });
        } catch (error) {
            next(error);
        }
    }

    public static verifyToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        try {
            const secret = this.getJwtSecret();
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
    }

    private static async verifyPassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private static generateToken(userId: number, email: string): string {
        const secret = this.getJwtSecret();
        return jwt.sign(
            { user_id: userId, email },
            secret,
            { expiresIn: this.TOKEN_EXPIRATION }
        );
    }

    private static getJwtSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET environment variable is not set");
        }
        return secret;
    }
}