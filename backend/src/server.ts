import "dotenv/config";
import sequelize from "./config/database";
import express, { Request, Response } from "express";

import app from "./app";
var db = require("./config/database");
import Session from "./models/session";
import User from "./models/user";

import { Server, Socket } from "socket.io";
const server = require("http").Server(app);
const io: Server = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
import path from "path";

let mongoose = require("mongoose");
const dbUrl = `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASS}@cluster0.fh2vc.mongodb.net/`;

import bodyParser from "body-parser";
import { Schema } from "mongoose";
import { UUID } from "sequelize";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
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
//--------------------------Socket.io--------------------------------
const Mensajes = mongoose.model(
  "Mensaje",
  new Schema({
    id: { type: Schema.Types.Number, required: true }, // Cambiar ObjectId a Number
    id_room: { type: Schema.Types.Number, required: true },
    message: {
      userName: { type: Schema.Types.String, required: true },
      text: { type: Schema.Types.String, required: true },
      date: { type: Schema.Types.Date, required: true }, // Asegúrate de que esta sea una fecha válida
    },
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

server.listen(8001, function () {
  console.log("Servidor corriendo en http://localhost:8000");
});

console.log("\n\n\n");
console.log("Server is running on port 8080");
console.log("\n\n\n");
//------------------------- Servidor de WebSockets -------------------------
const socketMap = {};
io.on("connection", async (socket: Socket) => {
  console.log("Un cliente se ha conectado", socket.id);
  let socketRoom: any;
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado", socket.id);
  });

  socket.on("join", (room) => {
    console.log(`Un cliente ${socket.id} se ha unido a la sala` + room);
    socketRoom = room;
    socket.join(room);
  });
  // Enviar los mensajes actuales al cliente que se conecta => via broadcast
  //socket.emit("mensajes", Mensajes);

  // Escuchar mensajes entrantes del cliente
  socket.on("chat", async (data) => {
    console.log("Mensaje recibido:", data);
    const { id, id_room, message } = data;
    //console.log(`msg: ${message}, room: ${id_room}`);
    try {
      // Crear y guardar un nuevo mensaje en la base de datos MongoDB
      const nuevoMensaje = new Mensajes({
        id: data.id,
        id_room: data.id_room,
        message: {
          userName: message.userName,
          text: message.text,
          date: message.date,
        },
      });
      console.log(nuevoMensaje);
      await nuevoMensaje.save(); // Esto guarda el mensaje en MongoDB

      // Recuperar todos los mensajes guardados en la base de datos para enviarlos a los clientes
      const mensajes = await Mensajes.find(); // Aquí recuperamos todos los mensajes

      // Enviar el array de mensajes actualizados a todos los clientes conectados
      console.log(`Socket Room ${socketRoom}`);
      socket.to(socketRoom).emit("chat", message);
    } catch (error) {
      console.error("Error al guardar o recuperar mensajes:", error);
    }
  });
});

//--------------------------Mongoose>DataBase--------------------------------
(async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB conectado correctamente");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  }
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/mensajes", (req: Request, res: Response) => {
  Mensajes.find({}, (err: any, mensajes: any) => {
    res.send(mensajes);
  });
});

app.post("/mensajes", async (req, res) => {
  console.log("Mensaje recibido:", req.body);
  const mensaje = new Mensajes({
    id: req.body.id,
    id_room: req.body.id_room || 1,
    message: {
      userName: req.body.message.userName,
      text: req.body.message.text,
      date: new Date(req.body.message.date),
    },
  });
  try {
    await mensaje.save();
    io.emit("mensaje", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error al guardar el mensaje:", err);
    res.sendStatus(500);
  }
});

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});