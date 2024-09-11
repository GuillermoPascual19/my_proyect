import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import sequelize from '../config/database';
import User from './user';

// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  role_name: number;
}
// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: 'Roles',
})
export class Roles extends Model<Roles, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({})
  declare id: number;

  @HasMany(() => User, { foreignKey: "role", as: "roles" })
  roles!: User[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role_name!: String;

}

export default Roles;