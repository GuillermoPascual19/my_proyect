import { DataTypes, Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import sequelize from '../config/database';

// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  subject_name: string;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: 'Subjects',
})
export class Students_teachers extends Model<Students_teachers, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @HasMany(() => Students_teachers)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject_name!: string;

}

export default Students_teachers;