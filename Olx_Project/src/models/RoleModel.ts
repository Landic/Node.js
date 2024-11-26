import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from './UserModel';

@Table({ tableName: 'Roles', timestamps: false })
export class Role extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    role_id!: number;

    @Column(DataType.STRING) role_name!: string;
    
    @HasMany(() => User) users!: User[];
}