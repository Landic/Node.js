import { Model, DataTypes } from 'sequelize';
import { connection } from '../config/DB';

export class PasswordResetToken extends Model {
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiryDate!: Date;
}

PasswordResetToken.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize: connection,
        modelName: 'PasswordResetToken',
});