import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './UserModel';
import { Advertisement } from './AdvertisementModel';

@Table({ tableName: 'Messages', timestamps: false })
export class Message extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    message_id!: number;

    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: false }) 
    sender_id!: number;
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: false })
    receiver_id!: number;
    @ForeignKey(() => Advertisement) @Column({ type: DataType.INTEGER, allowNull: false })
    ad_id!: number;
    
    @Column(DataType.STRING) avatar!: string;
    @Column(DataType.TEXT) content!: string;
    @Column(DataType.DATE) upload_date!: Date;
}