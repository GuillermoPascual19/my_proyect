import { DataTypes, Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import sequelize from "../config/database";
import Students_teachers from "./students-teachers";
import Session from "./session";
import Roles from "./roles";

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
  active: boolean;
  image: string;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: "Users",
})
export class User extends Model<User, UserCreationAttributes> {
  [x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column({})
  declare id: number;

  @HasMany(() => Session, { foreignKey: "id_user", as: "userSession" })
  userSession!: Session[];

  @HasMany(() => Students_teachers, { foreignKey: "id_student", as: "studentTeachers" })
  studentTeachers!: Students_teachers[];

  @HasMany(() => Students_teachers, { foreignKey: "id_teacher", as: "teacherStudents" })
  teacherStudents!: Students_teachers[];

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

  @ForeignKey(() => Roles)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role!: number;
  @BelongsTo(() => Roles, { foreignKey: "role", as: "roles" })
  roles!: Roles;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id_google!: string;
}

export default User;
