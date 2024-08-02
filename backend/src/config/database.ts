import 'dotenv/config'
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

console.log("USER ", process.env.DB_NAME)

const sequelize = new Sequelize(process.env.DB_NAME ||'name', process.env.DB_USER || 'user', process.env.DB_PASS || 'pass', {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: [path.join(__dirname, '../models')], // Asegúrate de que esta ruta sea correcta
  define: {
    timestamps: false, // Desactiva los timestamps globalmente
  },
});

sequelize.sync({ alter: true }) // Esto volverá a crear las tablas en la base de datos
  .then(() => {
    console.log('Database & tables created!');
  });

export default sequelize;
