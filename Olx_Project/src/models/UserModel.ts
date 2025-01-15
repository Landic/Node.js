import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { RoleModel } from './RoleModel';
import { MessageModel } from './MessageModel';
import { AdModel } from './AdModel';
import { PasswordResetModel } from './PasswordResetModel';

@Table({ tableName: 'Users', timestamps: false })
export class UserModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => RoleModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    roleId!: number;

    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    hashedPassword!: string;

    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    avatar!: string;

    @Column(DataType.DATE)
    createdAt!: Date;

    @Column(DataType.DATE)
    lastActive!: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isActive!: boolean;

    @BelongsTo(() => RoleModel)
    role!: RoleModel;

    @HasMany(() => MessageModel)
    messages!: MessageModel[];

    @HasMany(() => AdModel)
    ads!: AdModel[];

    @HasMany(() => PasswordResetModel)
    passwordResets!: PasswordResetModel[];
}
