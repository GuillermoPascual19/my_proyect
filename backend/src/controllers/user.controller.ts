import { Request, Response } from "express";
import { User } from "../models/user";
import utils from "../utils/utils"; // Adjust the import based on your project structure
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong getting all users" });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const roles = await User.findAll({ where: { role: "1" } });
    console.log("Fetched roles:", roles);
    res.json(roles);
  } catch (error) {
    console.log("Error fetching roles:", error);
    res
      .status(500)
      .json({ error: "Something with getting users by role went wrong" });
  }
};

const sendWelcomeEmail = async (user: User): Promise<void> => {
  if (!user.email) {
    console.error(
      "El usuario no tiene un correo electrónico al que mandar el mensaje de bienvenida"
    );
    return;
  }
  // Configura el transporte de Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // Puedes usar otros servicios como 'smtp', 'outlook', etc.
    auth: {
      user: process.env.EMAIL_USER, // Cambia esto por tu email
      pass: process.env.EMAIL_PASS, // Cambia esto por tu contraseña de email o una contraseña de aplicación
    },
  });

  // Define el contenido del correo
  const mailOptions = {
    from: process.env.EMAIL_USER, // Cambia esto por tu email
    to: user.email,
    subject: "Bienvenido a nuestra aplicación",
    html: `
      <h1>Hola ${user.name},</h1>
      <p>Gracias por registrarte en nuestra aplicación. Estamos emocionados de tenerte con nosotros.</p>
      <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
      <p>Su token de acceso '${user.access_token}'</p>
      <p>¡Bienvenido a bordo!</p>
      <a href="http://localhost:8080/activarCuenta">Activa tu cuenta</a>
      <p>Saludos,<br>El equipo de nuestra aplicación</p>
    `,
  };

  try {
    // Envía el correo
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo de registro:", error);
  }
};

//Registro de usuario----------------------------------------------

export const registerUser = async (req: Request, res: Response) => {
  if (!req.body)
    return res.status(401).json({ message: "The request body is empty" });

  if (
    !utils.keysChecker(req.body, [
      "username",
      "email",
      "password",
      "role",
      "name",
      "surname",
    ])
  ) {
    console.log("All fields are required for registering user"); // Log para verificar el error
    return res
      .status(400)
      .json({ message: "All fields are required for registering user" });
  } else {
    const { username, email, password, role, name, surname } = req.body;
    console.log("Registering user:", req.body); // Log para verificar los datos del usuario
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUser != null || existingUsername != null) {
        return res.status(402).json({ message: "User already exists" });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario
      const newUser = await User.create({
        name,
        username,
        surname,
        email,
        password: hashedPassword,
        access_token: utils.generateToken(32),
        password_token: utils.generateToken(32),
        role,
        active: 0,
      });

      sendWelcomeEmail(newUser); // Envía un correo de bienvenida al usuario

      console.log("New user created:", newUser); // Log para verificar la inserción
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error); // Log para capturar el error
      res.status(550).json({ message: "CAFE Server error", error });
    }
  }
};

//Login de usuario----------------------------------------------

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  await User.findOne({ where: { username } })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      bcrypt
        .compare(password, user.password)
        .then((validPassword) => {
          if (!validPassword) {
            return res.status(401).send("Invalid password");
          }

          console.log("User logged in successfully"); // Log para verificar
          return res
            .status(200)

            .send({ message: "User logged in successfully", user });
        })
        .catch((error) => {
          console.error("Error comparing passwords:", error); // Log para capturar el error
          return res.status(550).json({ message: "CAFE Server error", error });
        });
    })
    .catch((error) => {
      console.error("Error logging in, can´t find this user:", error); // Log para capturar el error
      return res.status(550).json({ message: "CAFE Server error", error });
    });
};

//Activar cuenta de usuario----------------------------------------------

export const activateAccount = async (req: Request, res: Response) => {
  const { access_token } = req.body;

  if (!access_token) {
    console.log("Access token is required"); // Log para verificar el error
    return res.status(400).send("Access token is required");
  }

  const user = await User.findOne({ where: { access_token } });

  if (!user) {
    console.log("User not found"); // Log para verificar el error
    return res.status(404).send("User not found");
  }

  user.active = 1;
  await user.save();

  console.log("Account activated successfully"); // Log para verificar
  res.status(200).json(user);
};

//Recuperar contraseña----------------------------------------------
export const recoverPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      console.log("User found successfully"); 

      if(user.active === 0){
        return res.status(403).send("User not activated");
      }
      // Genera un token de recuperación (aquí puedes agregar lógica para almacenar el token en la base de datos)
      const token = utils.generateToken(32);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperación de contraseña",
        //Cambiar la URL por la de tu aplicación
        text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: "http://localhost:8080/cambiarContraseña", ingrese el siguiente token en la web, de manera que podamos identificarle: "${token}"`,
      };
      try {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(501).send(error.toString());
          }
          res.status(200).send("Correo de recuperación enviado");
        });
      } catch (error) {
        console.error("Error sending recovery email:", error);
        return res.status(550).json({ message: "CAFE Server error", error });
      }
      
    })
    .catch((error) => {
      console.error("Error comparing passwords:", error); // Log para capturar el error
      return res.status(550).json({ message: "CAFE Server error", error });
    });
  } catch (error) {
    console.error("Error recovering password:", error); // Log para capturar el error
    return res.status(550).json({ message: "CAFE Server error", error });
  }  
};

//Cambiar contraseña----------------------------------------------
export const changePassword = async (req: Request, res: Response) => {
  const { access_token, password } = req.body;

  if (!access_token || !password) {
    return res.status(400).send("Access token and password are required");
  }

  try {
    const user = await User.findOne({ where: { access_token } });
    if (!user) {
      console.log("User not found. Access token isnt found"); // Log para verificar el error
      return res.status(403).send("User not found. Access token isnt found");
    }
    // guardar ese acces-token en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = utils.generateToken(32);
    user.access_token = token;
    user.password = hashedPassword;
    await user.save();
  
    console.log("Password changed and new access_token generated successfully"); // Log para verificar
    res.status(200).json(user);
  
    //Enviar email con nuevo acces-token  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Cambio de contraseña",
      //Cambiar la URL por la de tu aplicación
      text: `Ha cambiado de contraseña, sr/a ${user.name}.
        Para recuperar su contraseña en un futuro, le hemos concedido un nuevo token de acceso de manera que podamos identificarle. 
        Se lo adjuntamos a continuación: "${token}"`,
    };
    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send("Correo de recuperación enviado");
      });
    } catch (error) {
      console.error("Error sending recovery email:", error);
      return res.status(550).json({ message: "CAFE Server error", error });
    }
  } catch (error) {
    console.error("Error changing password:", error); // Log para capturar el error
    return res.status(550).json({ message: "CAFE Server error", error });
  }  
};
