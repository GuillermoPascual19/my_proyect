import 'dotenv/config'
//import app from './app';
import sequelize from './config/database';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

//-------------Recuperar contraseña del usuario------------------------------
//
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Puedes usar cualquier servicio de correo electrónico compatible
    auth: {
      user: 'tuemail@gmail.com',
      pass: 'tucontraseña'
    }
  });
  
  app.post('/recover-password', (req: Request, res: Response) => {
    const { email } = req.body;
  
    if (!email) {
      res.status(400).send('Email is required');
      return;
    }
  
    // Genera un token de recuperación (aquí puedes agregar lógica para almacenar el token en la base de datos)
    const token = Math.random().toString(36).substr(2);
  
    const mailOptions = {
      from: 'tuemail@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: https://tusitio.com/reset-password?token=${token}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Correo de recuperación enviado');
    });
  });
  

//------------------------Conectar el backend con la base de datos------------------------
const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        console.log("Start connection to db")
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

start();
