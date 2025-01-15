import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../models/UserModel';
import { RoleModel } from '../models/RoleModel';
import { AdModel } from '../models/AdModel';
import { CategoryModel } from '../models/CategoryModel';
import { MessageModel } from '../models/MessageModel';
import { PasswordResetModel } from '../models/PasswordResetModel';
import 'dotenv/config';

export const dbConnection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: console.log,
    models: [UserModel, RoleModel, AdModel, CategoryModel, MessageModel, PasswordResetModel],
});