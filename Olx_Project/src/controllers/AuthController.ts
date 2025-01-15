import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";
import { RoleModel } from "../models/RoleModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class AuthHandler {
    static async registerUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password, name, roleId } = req.body;
            const existingUser = await UserModel.findOne({ where: { email } });
            const role = await RoleModel.findByPk(roleId);

            if (existingUser) return res.status(400).json({ message: "Email already in use" });
            if (!role) return res.status(400).json({ message: "Role not found" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                email,
                hashedPassword,
                name,
                roleId,
                createdAt: new Date(),
                lastActive: new Date(),
            });

            return res.status(201).json({ message: "User registered successfully", newUser });
        } catch (error) {
            console.error("Registration error:", error);
            next(error);
        }
    }

    static async loginUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ where: { email } });
            if (!user) return res.status(400).json({ message: "Invalid email or password" });

            const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isPasswordMatch) return res.status(400).json({ message: "Invalid email or password" });

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            return res.json({ message: "Login successful", token });
        } catch (error) {
            next(error);
        }
    }

    static verifyToken(req: Request, res: Response, next: NextFunction): any {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).json({ message: "Token not provided" });
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            (req as any).user = decoded;
            next();
        });
    }
}
