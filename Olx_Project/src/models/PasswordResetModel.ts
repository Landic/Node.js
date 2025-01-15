import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { UserModel } from './UserModel';

@Table({ tableName: 'PasswordResets', timestamps: false })
export class PasswordResetModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;

    @Column(DataType.STRING)
    token!: string;

    @Column(DataType.DATE)
    createdAt!: Date;

    @Column(DataType.DATE)
    expiresAt!: Date;
}
