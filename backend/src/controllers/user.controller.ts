import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import Utils from '../config/utils'; // Adjust the import based on your project structure
import db from '../config/database'; // Adjust the import based on your project structure
import nodemailer from 'nodemailer';


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

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
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

/*
export const checkValidEmail = (req: Request, res: Response, next: NextFunction) => {
	if (Utils.keysChecker(req.body, ["email"])) {
		const email = req.body.email;
		db.users.findOne({ where: { email: email } }).then((user: any) => {
			if (!user) return next();
			else {
				return res
					.status(400)
					.send(
						Utils.buildErrorResponse(
							"EMAIL_ALREADY_EXISTS",
							"Email already exists",
							"Email already exists in database"
						)
					);
			}
		});
	} else
		return res
			.status(400)
			.send(
				Utils.buildErrorResponse(
					"EMAIL_NOT_FOUND",
					"Email not found",
					"Email not found in body please provide email in body"
				)
			);
};
*/
