import { Model, DataTypes } from 'sequelize';
import { dbConnection } from '../config/dbConnection';

export class PasswordResetTokenModel extends Model {
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiresAt!: Date;
}

PasswordResetTokenModel.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: dbConnection,
        modelName: 'PasswordResetToken',
    }
);
