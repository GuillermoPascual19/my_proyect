import { DataTypes, Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import sequelize from '../config/database';
import User from './user';
import Subject from './subjects';
// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  id_student: number;
  id_teacher: number;
  id_subject: number;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: 'Students_Teachers',
})
export class Students_teachers extends Model<Students_teachers, UserCreationAttributes> {
  [x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_student!: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_teacher!: number;

  @ForeignKey(() => Subject)
  @BelongsTo(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_subject!: number;
}

export default Students_teachers;