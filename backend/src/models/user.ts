import { DataTypes } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import sequelize from '../config/database';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: string;

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  $add: '',
  $set: '',
  $get: '',
  $count: '',
  $create: '',
  $has: '',
  $remove: '',
  reload: '',
  _attributes: '',
  dataValues: '',
  _creationAttributes: '',
  isNewRecord: '',
  sequelize: '',
  where: '',
  getDataValue: '',
  setDataValue: '',
  get: '',
  set: '',
  setAttributes: '',
  changed: '',
  previous: '',
  save: '',
  validate: '',
  update: '',
  destroy: '',
  restore: '',
  increment: '',
  decrement: '',
  equals: '',
  equalsOneOf: '',
  toJSON: '',
  isSoftDeleted: '',
  _model: '',
  addHook: '',
  removeHook: '',
  hasHook: '',
  hasHooks: '',
  name: '',
  surname: '',
  role: ''
}, {
  sequelize,
  modelName: 'User'
});

export default User;
