import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { UserModel } from './UserModel';
import { AdModel } from './AdModel';

@Table({ tableName: 'Messages', timestamps: false })
export class MessageModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    senderId!: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    receiverId!: number;

    @ForeignKey(() => AdModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    adId!: number;

    @Column(DataType.STRING)
    avatar!: string;

    @Column(DataType.TEXT)
    content!: string;

    @Column(DataType.DATE)
    sentAt!: Date;
}
