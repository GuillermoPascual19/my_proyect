import "dotenv/config";
import sequelize from "./config/database";
import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import app from "./app";
var db = require("./config/database");
import Session from "./models/session";
import User from "./models/user";

import { Server, Socket } from "socket.io";
const server = require("http").Server(app);
let io = require("socket.io")(server);
import path from "path";

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
      done: (arg0: any, user?: any) => any
    ) => {
      try {
        let user = await User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        if (!user) {
          const error = new Error("Usuario no registrado en el sistema.");
          return done(error, false);
        }
        if (user.active === false) {
          const error = new Error("Usuario no activado en el sistema.");
          return done(error, false);
        }

        try {
          user.set({ id_google: profile.id });
          user = await user.save();
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
console.log(path.join(__dirname, "../../frontend/dist"));
//Socket.io
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// // Si no se encuentra la ruta, servir el archivo de Vue.js
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",  // Tu frontend
    methods: ["GET", "POST"]
  }
});

server.listen(8000, function () {
  ////Pondremos el servidor a escuchar en localhost con el puerto 8080
  console.log("Servidor corriendo en http://localhost:8000");
});

// Array de mensajes inicial
let mensajes = [
  { profesor: "Julio", texto: "Hola! ¿Cómo estáis?" },
  { profesor: "Alumno1", texto: "Muy bien! ¿y tú?" },
];
console.log("\n\n\n");  
console.log("Server is running on port 8080");
console.log("\n\n\n");
// Servidor de WebSockets
io.on("connection", (socket: Socket) => {
  console.log("Un cliente se ha conectado");

  // Enviar los mensajes actuales al cliente que se conecta
  socket.emit("mensajes", mensajes);

  // Escuchar mensajes entrantes del cliente
  socket.on("mensajes", (data) => {
    console.log("Mensaje recibido:", data);
    mensajes.push(data); // Añadir mensaje al array de mensajes

    // Enviar el mensaje a todos los clientes conectados
    io.emit("mensajes", mensajes);
  });
});

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
