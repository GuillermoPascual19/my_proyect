import 'dotenv/config'
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';

console.log("USER ", process.env.DB_NAME)

const sequelize = new Sequelize(process.env.DB_NAME ||'name', process.env.DB_USER || 'user', process.env.DB_PASS || 'pass', {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: [User],
});

export default sequelize;
