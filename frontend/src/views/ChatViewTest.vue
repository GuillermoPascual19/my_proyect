<template>
  <div class="App">
    <div class="box">
      <div class="messages" id="mensajes">
        <div v-for="(msg, index) in messageReceiveList" :key="index">
          <div class="message">
            <h4>{{ msg.userName }}</h4>
            <p>{{ msg.text }}</p>
          </div>
        </div>
      </div>
      <form class="input-div" @submit.prevent="sendMessage">
        <input
          type="text"
          placeholder="Type in text"
          v-model="inputMessageText"
          id="nombre"
        />
        <button type="submit" id="enviar">Submit</button>
      </form>
      <div>
        <h1>Room: {{ room }}</h1>
        <button v-for="(r, i) in rooms" :key="i" @click="setRoom(r)">
          {{ r }}
        </button>
      </div>
    </div>
    <div class="botonesCSV">
      <v-btn class="exportarCSV" @click="exportarCSV">Exportar CSV</v-btn>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import axios from "axios";
import { saveAs } from "file-saver";
let socket = null;

export default {
  name: "ViewChat",
  data() {
    return {
      inputMessageText: "",
      messageReceiveList: [],
      userName: "",
      token: "",
      rooms: [1, 2, 3],
      room: 1,
    };
  },

  methods: {
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.error("User not found, redirecting to login.");
          this.$router.push("/Error");
        } else {
          this.userName = `${user.name} ${user.surname}`;
          this.token = user.acessToken;
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        this.userName = "Usuario";
      }
    },

    initiateSocket(room) {
      socket = io("http://localhost:8001"); // Cambia el puerto si es necesario
      console.log(`Connecting socket...`);
      if (socket && room) socket.emit("join", room);
    },

    disconnectSocket() {
      console.log("Disconnecting socket...");
      if (socket) socket.disconnect();
    },

    subscribeToChat(cb) {
      if (!socket) return true;
      console.log("Listening for messages...");
      socket.on("chat", (msg) => {
        console.log("Websocket event received!");
        return cb(null, msg);
      });
    },

    receiveMessage() {
      this.subscribeToChat((err, mensaje) => {
        if (!err) {
          this.agregarMensaje(mensaje);
        }
      });
    },

    agregarMensaje(mensaje) {
      if (Array.isArray(this.messageReceiveList)) {
        this.messageReceiveList.push(mensaje);
      } else {
        console.error("messageReceiveList no es un arreglo");
      }
    },

    obtenerMensajes() {
      axios
        .get("http://localhost:3000/mensajes")
        .then((response) => {
          const mensajes = response.data ? response.data.mensajes : null;
          console.log("Mensajes obtenidos:", mensajes);
          if (Array.isArray(mensajes)) {
            mensajes.forEach(this.agregarMensaje);
          } else {
            console.error("No hay mensajes para mostrar");
          }
        })
        .catch((error) => {
          console.error("Error al obtener los mensajes:", error);
        });
    },

    sendMessage() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (this.inputMessageText.trim() !== "") {
        // axios
        //   .post("http://localhost:3000/mensajes", mensaje)
        //   .then(() => {
        //     console.log("Mensaje enviado:", mensaje);
        //   })
        //   .catch((error) => {
        //     console.error("Error al enviar el mensaje:", error);
        //   });
        const mensaje = {
          userName: this.userName,
          text: this.inputMessageText,
          date: new Date(),
        };
        this.agregarMensaje(mensaje);
        if (socket)
          socket.emit("chat", {
            id: user.id,
            id_room: this.room,
            message: {
              userName: this.userName,
              text: this.inputMessageText,
              date: new Date(),
            },
          });
        this.inputMessageText = ""; // Limpiar el input
      }
    },
    setRoom(room) {
      this.disconnectSocket(); // Desconectar del socket de la sala actual
      this.room = room;
      this.initiateSocket(this.room); // Volver a conectar a la nueva sala
      this.receiveMessage(); // Escuchar mensajes en la nueva sala
    },

    //Descarga los mensajes en un archivo CSV
    async exportarCSV() {
      const mensajes = this.messageReceiveList.map((msg) => ({
        userName: `"${msg.userName}"`,
        text: `"${msg.text}"`,
        date: `"${msg.date}"`,
      }));

      const csvContent = [
        ["User Name\t", "Message\t", "Date"],
        ...mensajes.map((msg) => [msg.userName, msg.text, msg.date]),
      ]
        .map((e) => e.join("||"))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "chat_mensajes.csv");
    },
  },

  mounted() {
    this.getUserName();
    this.initiateSocket(this.room);

    // Recibir mensajes en tiempo real
    this.receiveMessage();
    // Obtener mensajes previamente guardados en el servidor
    this.obtenerMensajes();
  },

  beforeUnmount() {
    this.disconnectSocket(); // Desconectar el socket cuando el componente se destruya
  },
};
</script>

<style scoped>
.App {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.box {
  width: 400px;
  height: 700px;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.message {
  background-color: #f0f0f0;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}
.input-div {
  display: flex;
  justify-content: bottom;
  align-items: bottom;
}
</style>
