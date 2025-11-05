import { DataTypes, Optional } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import sequelize from '../config/database';
import Students_teachers from './students-teachers';

// Definir los atributos que tendrá el modelo User
interface SubjectAttributes {
  id: number;
  subject_name: string;
}

// Define una interfaz para la creación de asignaturas
interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

@Table({
  timestamps: false, // Desactivar timestamps a nivel de tabla
  tableName: 'Subjects',
})
export class Subject extends Model<Subject, SubjectCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({})
  declare id: number;
  @HasMany(() => Students_teachers, { foreignKey: "id_subject", as: "subjectStdTe" })
  subjectStdTe!: Students_teachers[];
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject_name!: string;
}


export default Subject;