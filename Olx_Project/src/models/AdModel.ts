import { Model, Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { UserModel } from './UserModel';
import { CategoryModel } from './CategoryModel';
import { MessageModel } from './MessageModel';

@Table({ tableName: 'Advertisements', timestamps: false })
export class AdModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;

    @ForeignKey(() => CategoryModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    categoryId!: number;

    @Column(DataType.STRING)
    title!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column(DataType.FLOAT)
    price!: number;

    @Column(DataType.STRING)
    location!: string;

    @Column(DataType.DATE)
    uploadedAt!: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isActive!: boolean;

    @Column({ type: DataType.JSON, allowNull: true })
    images!: string[];

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isSold!: boolean;

    @HasMany(() => MessageModel)
    messages!: MessageModel[];
}
