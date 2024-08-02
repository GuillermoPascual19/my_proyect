import { DataTypes, Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import sequelize from '../config/database';

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
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_student!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_teacher!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_subject!: number;
}

export default Students_teachers;