import { DataTypes, Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import sequelize from "../config/database";

// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  access_token: string;
  password_token: string;
  role: string;
  active: number;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: "Users",
})
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  access_token!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password_token!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  active!: number;
}

export default User;
