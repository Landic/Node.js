import { Model, Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { Role } from './role-model';
import { Message } from './message-model';
import { Advertisement } from './ad-model';
import { PasswordReset } from './Password-Reset-model';

@Table({ tableName: 'Users', timestamps: false })
export class User extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    user_id!: number;

    @ForeignKey(() => Role) @Column({ type: DataType.INTEGER, allowNull: false })
    role_id!: number;

    @Column(DataType.STRING) email!: string;
    @Column(DataType.STRING) hash_pass!: string;
    @Column(DataType.STRING) name!: string;
    @Column(DataType.STRING) avatar!: string;
    @Column(DataType.DATE) created_date!: Date;
    @Column(DataType.DATE) last_activity!: Date;
    @Column({ type: DataType.BOOLEAN, defaultValue: false }) status!: boolean;

    @HasMany(() => Message) messages!: Message[];
    @HasMany(() => Advertisement) advertisements!: Advertisement[];
    @HasMany(() => PasswordReset) passwords_reset!: PasswordReset[];
}