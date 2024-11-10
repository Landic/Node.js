import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user-model";
import { Role } from "../models/role-model";
import { Advertisement } from "../models/ad-model";
import { Category } from "../models/category-model";
import { Message } from "../models/message-model";
import { PasswordReset } from "../models/Password-Reset-model";
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