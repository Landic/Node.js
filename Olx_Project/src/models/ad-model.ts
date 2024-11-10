import { Model, Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from './user-model';
import { Category } from './category-model';
import { Message } from './message-model';

@Table({ tableName: 'Advertisements', timestamps: false })
export class Advertisement extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    ad_id!: number;

    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;
    @ForeignKey(() => Category) @Column({ type: DataType.INTEGER, allowNull: false })
    category_id!: number;

    @Column(DataType.STRING) title!: string;
    @Column(DataType.TEXT) description!: string;
    @Column(DataType.FLOAT) price!: number;
    @Column(DataType.STRING) location!: string;
    @Column(DataType.DATE) upload_date!: Date;
    @Column({ type: DataType.BOOLEAN, defaultValue: false }) status!: boolean;

    @HasMany(() => Message) messages!: Message[];
}