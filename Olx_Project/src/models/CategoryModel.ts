import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Advertisement } from './AdvertisementModel';

@Table({ tableName: 'Categories', timestamps: false })
export class Category extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    category_id!: number;

    @Column(DataType.STRING) category_name!: string;

    @HasMany(() => Advertisement) advertisements!: Advertisement[];
}