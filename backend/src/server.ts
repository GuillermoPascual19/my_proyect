import "dotenv/config";
import sequelize from "./config/database";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import app from "./app";
var db = require('./config/database');
import Session from "./models/session";
import User from "./models/user";

//-------------Recuperar contraseña del usuario------------------------------
//
// const transporter = nodemailer.createTransport({
//   service: "Gmail", // Puedes usar cualquier servicio de correo electrónico compatible
//   auth: {
//     user: "tuemail@gmail.com",
//     pass: "tucontraseña",
//   },
// });

// app.post("/recover-password", (req: Request, res: Response) => {
//   const { email } = req.body;

//   if (!email) {
//     res.status(400).send("Email is required");
//     return;
//   }

//   // Genera un token de recuperación (aquí puedes agregar lógica para almacenar el token en la base de datos)
//   const token = Math.random().toString(36).substr(2);

//   const mailOptions = {
//     from: "tuemail@gmail.com",
//     to: email,
//     subject: "Recuperación de contraseña",
//     text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: https://tusitio.com/reset-password?token=${token}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).send("Correo de recuperación enviado");
//   });
// });

//------------------------Conectar el backend con la base de datos------------------------
const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    console.log("Start connection to db");
    await sequelize.authenticate(); // Verifica la conexión a la base de datos
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

//-------------Login del usuario con google------------------------------
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Configure Passport.js with your Google API credentials
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: "http://localhost:3000/api/google/callback",
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: ( arg0: any, user?: any) => any
    ) => {
      try {
        let user = await User.findOne({
          where: {
            email: profile.emails[0].value,
          }
        });
        if (!user) {
          const error = new Error('Usuario no registrado en el sistema.');
          return done(error, false); 
        } 
        if (user.active === false) {
          const error = new Error('Usuario no activado en el sistema.');
          return done(error, false);
        }

        try {
          user.set({ id_google: profile.id });
          user = await user.save()
        } catch (error) {
          console.error("Error al actualizar id_google: ", error);
          console.log("Error al actualizar id_google: ", error);
        }        
        
        const newSession = await Session.create({
          id_user: user.id,
          signed_at: new Date(),
        });

        console.log("\n\nSession created: ", newSession, user.id_google);

        return done(null, user);  
      } catch (error) {
        return done(error, false);
      }
    }
  )
);


app.use(passport.initialize());

// // Start the server
// app.listen(PORT, () => {
// console.log(`Server running at http://localhost:${PORT}`);
// });

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
