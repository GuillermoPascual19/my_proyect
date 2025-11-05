import { DataTypes, Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import sequelize from "../config/database";
import User from "./user";

// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  id_user: number;
  signed_at: Date;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: "Sessions",
})
export class Session extends Model<Session, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_user!: number;
  @BelongsTo(() => User, { foreignKey: "id_user", as: "userSession" })
  users!: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  signed_at!: Date;
}

export default Session;
