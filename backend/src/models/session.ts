import { DataTypes, Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import sequelize from '../config/database';

// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  id_user: number;
  signed_at: Date;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: 'Sessions',
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
  id_user!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  signed_at!: Date;

}

export default Students_teachers;