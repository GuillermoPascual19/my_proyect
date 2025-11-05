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
import Subject from "./subjects";
// Definir los atributos que tendrá el modelo User
interface UserAttributes {
  id: number;
  id_student: number;
  id_teacher: number;
  id_subject: number;
}

// Define una interfaz para la creación de usuarios
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: "Students_Teachers",
})
export class Students_teachers extends Model<
  Students_teachers,
  UserCreationAttributes
> {
  [x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column({})
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_student!: number;
  @BelongsTo(() => User, { foreignKey: "id_student", as: "studentTeachers" })
  StudentUser!: User;
  
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_teacher!: number;
  @BelongsTo(() => User, { foreignKey: "id_teacher", as: "teacherStudents" })
  teacher!: User;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_subject!: number;
  @BelongsTo(() => Subject, { foreignKey: "id_subject", as: "subjectStdTe" })
  subjectStdTe!: Subject;
}

export default Students_teachers;
