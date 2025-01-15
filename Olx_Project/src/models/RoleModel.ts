import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { UserModel } from './UserModel';

@Table({ tableName: 'Roles', timestamps: false })
export class RoleModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    name!: string;

    @HasMany(() => UserModel)
    users!: UserModel[];
}