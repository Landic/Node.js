import { Sequelize } from "sequelize-typescript";
import { User } from "../models/UserModel";
import { Role } from "../models/RoleModel";
import { Advertisement } from "../models/AdvertisementModel";
import { Category } from "../models/CategoryModel";
import { Message } from "../models/MessageModel";
import { PasswordReset } from "../models/PasswordResetModel";
import "dotenv/config";

export const connection = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User, Role, Advertisement, Category, Message, PasswordReset],
});