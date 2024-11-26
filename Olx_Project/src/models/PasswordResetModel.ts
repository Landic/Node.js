import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './UserModel';

@Table({ tableName: 'PasswordResets', timestamps: false })
export class PasswordReset extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    reset_id!: number;

    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @Column(DataType.STRING) token!: string;
    @Column(DataType.DATE) created_date!: Date;
    @Column(DataType.DATE) end_date!: Date;
}