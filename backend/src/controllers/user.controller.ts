import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import utils from '../utils/utils' // Adjust the import based on your project structure
import db from '../config/database'; // Adjust the import based on your project structure
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  // Genera un token de recuperación (aquí puedes agregar lógica para almacenar el token en la base de datos)
  const token = Math.random().toString(36).substr(2);

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role, name, surname } = req.body;
  console.log('Registering user:', req.body); // Log para verificar los datos del usuario

  console.log("Registering user:");
  console.log(username);
  console.log(name);
  console.log(surname);
  console.log(email);
  console.log(password);
  console.log(role);
  // if (!username || !name || !surname || !email || !password || !role) {
  //   throw new Error("All fields are required cacaulopedopipi");
  // } 
  if(!utils.keysChecker(req.body, ['username', 'email', 'password', 'role', 'name', 'surname'])){
      console.log('All fields are required subnormal'); // Log para verificar el error
      return res.status(400).json({ message: 'All fields are required subnormal' });
    }
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUser || existingUsername) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encriptar la contraseña
    //const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = utils.cypherText(password).data;
    const genAccess_token = utils.generateToken(32);
    const genPassword_token = utils.generateToken(32);
    const activated = 0;

    // Crear un nuevo usuario
    const newUser = await User.create({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      role,
      password_token: genPassword_token,
      access_token: genAccess_token,
      active: activated,
    });

    console.log('New user created:', newUser); // Log para verificar la inserción
    res.status(201).json({ message: 'User registered successfully', user: newUser });
    //res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error); // Log para capturar el error
    res.status(500).json({ message: 'CAFE Server error', error });
  }
  
};
