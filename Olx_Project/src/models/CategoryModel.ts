import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { AdModel } from './AdModel';

@Table({ tableName: 'Categories', timestamps: false })
export class CategoryModel extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column(DataType.STRING)
    name!: string;

    @HasMany(() => AdModel)
    ads!: AdModel[];
}