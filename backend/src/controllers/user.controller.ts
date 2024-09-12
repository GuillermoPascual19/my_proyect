import e, { Request, Response } from "express";
import User from "../models/user";
import Session from "../models/session";
import Students_teachers from "../models/students-teachers";
import Subject from "../models/subjects";
import utils from "../utils/utils";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import Inspector from "inspector";
import Roles from "../models/roles";
import sequelize from "../config/database";
import exp from "constants";
import bodyparser from "body-parser";

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
      <a href="http://localhost:8080/activateAccount">Activa tu cuenta</a>
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
        active: false,
        image: "",
      });
      if (role === 1) {
        const newStudent = await Students_teachers.create({
          id_student: newUser.id,
          id_teacher: 0, // Provide the id_teacher value here
          id_subject: 0, // Provide the id_subject value here
        });
      } else if (role === 2) {
        const newTeacher = await Students_teachers.create({
          id_student: 0, // Provide the id_student value here
          id_teacher: newUser.id,
          id_subject: 0, // Provide the id_subject value here
        });
      }
      sendWelcomeEmail(newUser); // Envía un correo de bienvenida al usuario

      console.log("New user created:", newUser); // Log para verificar la inserción
      res
        .status(200)
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
    .then(async (user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      if (user.active === false) {
        return res.status(404).send("User not activated");
      }
      try {
        const newSession = await Session.create({
          id_user: user.id,
          signed_at: new Date(),
        });
      } catch (error) {
        console.error("Error creating session:", error); // Log para capturar el error
        return res.status(550).json({ message: "CAFE Server error", error });
      }

      console.log(user);
      bcrypt
        .compare(password, user.dataValues.password)
        .then((validPassword) => {
          if (!validPassword) {
            return res.status(400).send("Invalid password");
          }

          if (user.active === false) {
            return res.status(404).send("User not activated");
          }

          // Generar el JWT
          const loginToken = jwt.sign(
            {
              id: user.id,
              username: user.username,
              name: user.name,
              surname: user.surname,
              email: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET || "secret", // Asegúrate de usar una clave secreta segura
            { expiresIn: "1h" }
          );
          console.log("User logged in successfully");

          return res
            .status(200)

            .send({ message: "User logged in successfully", loginToken, user });
        })
        .catch((error) => {
          console.error("Error comparing passwords:", error); // Log para capturar el error
          return res.status(500).json({ message: "CAFE Server error", error });
        });
    })
    .catch((error) => {
      console.error("Error logging in, can´t find this user:", error); // Log para capturar el error
      return res.status(500).json({ message: "CAFE Server error", error });
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

  user.active = true;
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

        if (user.active === false) {
          return res.status(403).send("User not activated");
        }
        const token = user.password_token;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Recuperación de contraseña",
          text: `Para recuperar tu contraseña, haz clic en el siguiente enlace e ingrese en la siguienta web: "http://localhost:8080/cambiarContraseña?token=${token}" `,
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
        console.error("Error comparing passwords:", error);
        return res.status(550).json({ message: "CAFE Server error", error });
      });
  } catch (error) {
    console.error("Error recovering password:", error);
    return res.status(550).json({ message: "CAFE Server error", error });
  }
};

//Cambiar contraseña----------------------------------------------
export const changePassword = async (req: Request, res: Response) => {
  const { password_token, password } = req.body;

  if (!password_token || !password) {
    return res.status(400).send("Access token and password are required");
  }

  try {
    const user = await User.findOne({ where: { password_token } });
    if (!user) {
      console.log("User not found. Access token isnt found"); // Log para verificar el error
      return res.status(403).send("User not found. Access token isnt found");
    }
    // guardar ese acces-token en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = utils.generateToken(32);
    user.password_token = token;
    user.password = hashedPassword;
    await user.save();

    console.log(
      "Password changed and new password_token generated successfully"
    ); // Log para verificar
    res.status(200).json(user);

    //Enviar email con nuevo acces-token
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Cambio de contraseña",
      //Cambiar la URL por la de tu aplicación
      text: `Buenas, sr/a ${user.name}. Ha cambiado de contraseña.`,
    };
    try {
      transporter.sendMail(mailOptions, (error) => {
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

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("User ID is required");
  }

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send("User not found");
    }

    await user.destroy();
    console.log(`User with ID ${id} deleted successfully`); // Log para verificar la eliminación
    res.status(200).send(`User with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error); // Log para capturar el error
    res.status(550).json({ message: "CAFE Server error", error });
  }
};

//Obtener asignaturas y su respectivo profesor por estudiante----------------------------------------------
export const getSubjectsByStudent = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const subjectsWithTeachers = await Students_teachers.findAll({
      where: { id_student: id },
      include: [
        {
          model: Subject,
          attributes: ["subject_name"],
          as: "subjectStdTe",
        },
        {
          model: User,
          as: "teacherStudents",
          where: { role: 2 },
          attributes: ["name", "surname", "email"],
        },
      ],
    });

    if (!subjectsWithTeachers || !subjectsWithTeachers.length) {
      console.log("No subjects found for this user");
      const temp: [] = [];
      return res
        .status(200)
        .send({ tem: "No subjects found for this user", temp });
    }
    const studentData = subjectsWithTeachers
      .map((prof) => {
        const subjectName = prof.subjectStdTe?.subject_name || "-";
        const teachers =
          prof.teacherStudents && prof.teacherStudents.length > 0
            ? prof.teacherStudents
            : [{ name: "-", surname: "-", email: "-" }];

        return teachers.map(
          (teacher: { name: any; surname: any; email: any }) => ({
            name: teacher.name || "-",
            surname: teacher.surname || "-",
            email: teacher.email || "-",
            subject: subjectName,
          })
        );
      })
      .flat();
    console.log("Student subjects:", studentData);
    res.json(studentData);
  } catch (error) {
    console.error("Error getting subjects and teachers:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//Obtener estudiantes----------------------------------------------
export const getStudents = async (req: Request, res: Response) => {
  try {
    console.log("Getting students");
    const students = await User.findAll({
      where: { role: 1 },
      attributes: ["name", "surname", "email"],
      include: [
        {
          model: Students_teachers,
          as: "studentTeachers",
          include: [
            {
              model: Subject,
              as: "subjectStdTe",
              attributes: ["subject_name"],
            },
          ],
        },
      ],
    });
    if (!students || !students.length) {
      return res.status(404).send("No students found.");
    }

    const studentData = students.map((student) => {
      const temp = student.get({ plain: true });
      console.log("Student:", temp);
      const subjects =
        temp.studentTeachers.length > 0
          ? temp.studentTeachers.map(
              (st) => st.subjectStdTe?.subject_name || " -"
            )
          : " - ";
      return {
        name: temp.name,
        surname: temp.surname,
        email: temp.email,
        subjects: subjects,
      };
    });
    console.log("Student subjects:", studentData);
    return res.status(200).json(studentData);
  } catch (error) {
    console.error("Error getting students:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
//Cerrar sesión----------------------------------------------
export const closeSession = async (req: Request, res: Response) => {
  const id = req.user.id;

  try {
    const user = await Session.destroy({ where: { id_user: id } });
    console.log("User logged out successfully");
    res.status(200).send("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//Cambiar credenciales----------------------------------------------
export const changeCrendentials = async (req: Request, res: Response) => {
  const { email, name, surname, rol, id } = req.body;

  if (!email && !name && !surname && !rol && !id) {
    return res
      .status(400)
      .send("Credentials is required for changing user credentials");
  }

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.role = rol;
    user.email = email;
    user.name = name;
    user.surname = surname;
    await user.save();

    try {
      // Generar el JWT
      const loginToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "secret", // Asegúrate de usar una clave secreta segura
        { expiresIn: "1h" }
      );
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Server error", error });
    }
    console.log("User credentials changed successfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error changing user credentials:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//Asignar asignatura----------------------------------------------
export const assignSubject = async (req: Request, res: Response) => {
  const { id, email, subject } = req.body;

  if (!email || !subject || !id) {
    console.log("Email, id, and subject are required");
    return res.status(400).send("Email, id, and subject are required");
  }

  const transaction = await sequelize.transaction(); // Start transaction

  try {
    console.log(
      "\n\n\nAssigning subject to student:------------------------\n\n\n"
    );
    const userStud = await User.findOne({ where: { email }, transaction });
    if (!userStud) {
      console.log("User student not found");
      return res.status(404).send("User student not found");
    }

    const userTe = await User.findOne({ where: { id }, transaction });
    if (!userTe) {
      console.log("User teacher not found");
      return res.status(404).send("User teacher not found");
    }

    let subjectsEntry = await Subject.findOne({
      where: { subject_name: subject },
      transaction,
    });
    if (!subjectsEntry) {
      console.log("Creating new subject entry:", subject);
      subjectsEntry = await Subject.create(
        { subject_name: subject },
        { transaction }
      );
    }

    const comprobacion = await Students_teachers.findOne({
      where: {
        id_student: userStud.id,
        id_teacher: userTe.id,
        id_subject: subjectsEntry.id,
      },
      transaction,
    });
    if (comprobacion) {
      return res.status(405).send("Subject already assigned to the student");
    }
    await Students_teachers.create(
      {
        id_student: userStud.id,
        id_teacher: userTe.id,
        id_subject: subjectsEntry.id,
      },
      { transaction }
    );

    await transaction.commit(); // Commit transaction

    return res.status(200).send("Subject assigned successfully to the student");
  } catch (error) {
    await transaction.rollback(); // Rollback transaction in case of error
    console.log("Error assigning subject:");
    console.error("Error assigning subject:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//Desasignar asignatura----------------------------------------------
export const unassignSubject = async (req: Request, res: Response) => {
  const { id, email, subject } = req.body;

  if (!email && !subject && !id) {
    return res.status(400).send("Email and subject are required");
  }

  try {
    const userStud = await User.findOne({ where: { email } });
    if (!userStud) {
      return res.status(404).send("User student not found");
    }

    const subjects = await Subject.findOne({
      where: { subject_name: subject },
    });
    if (!subjects) {
      return res.status(404).send("Subject not found");
    }
    const user = await Students_teachers.destroy({
      where: {
        id_student: userStud.id,
        id_teacher: id,
        id_subject: subjects.id,
      },
    });
    return res
      .status(200)
      .send("Subject unassigned successfully to the student");
  } catch (error) {
    console.error("Error assigning subject:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
//Conseguir el número de estudiantes por asignatura----------------------------------------------
export const getNumStudentsPerSubject = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log("Getting students for teacher:", id);
  try {
    const subjectsCount = await Students_teachers.findAll({
      where: { id_teacher: id },
      attributes: [
        "id_subject",
        [sequelize.fn("COUNT", sequelize.col("id_student")), "num_students"],
      ],
      group: ["id_subject", "subjectStdTe.subject_name", "subjectStdTe.id"],
      include: [
        {
          model: Subject,
          as: "subjectStdTe",
          attributes: ["subject_name"],
        },
      ],
    });

    if (!subjectsCount || subjectsCount.length === 0) {
      return res.status(404).send("No students found.");
    }
    const result = subjectsCount.map((entry) => ({
      subject_name:
        entry.dataValues.subjectStdTe.dataValues.subject_name || "-",
      num_students: entry.dataValues.num_students,
    }));

    if (!result || result.length === 0) {
      return res.status(404).send("No students found for the given teacher.");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting students:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
//Subir imagen----------------------------------------------
export const uploadImages = async (req: Request, res: Response) => {
  const { access_token } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).send("Image is required");
  }

  try {
    const user = await User.findOne({ where: { access_token } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.image = `/uploads/${(file as Express.Multer.File).filename}`;

    user.set({ image: `/uploads/${(file as Express.Multer.File).filename}` });

    await user.save();

    console.log("Image uploaded successfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
