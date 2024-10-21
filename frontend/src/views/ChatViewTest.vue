<template>
  <div class="App">
    <div class="box">
      <div class="messages">
        <div v-for="(msg, index) in messageReceiveList" :key="index">
          {{ msg.profesor }}: {{ msg.texto }}
        </div>
      </div>
      <form class="input-div" @submit.prevent="submitMessage">
        <input
          type="text"
          placeholder="Type in text"
          v-model="inputMessageText"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "ViewChat",
  data() {
    return {
      inputMessageText: "",
      messageReceiveList: [],
      socket: null,
      userName: "",
      token: "",
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
    receiveMessage() {
      // Escuchar los mensajes desde el servidor
      this.socket.on("mensajes", (data) => {
        console.log("Mensajes recibidos:", data);
        this.messageReceiveList = data; // Actualizar la lista de mensajes
      });
    },
    sendMessage() {
      if (this.inputMessageText.trim() !== "") {
        const mensaje = {
          profesor: this.userName,
          texto: this.inputMessageText,
        };
        this.socket.emit("mensajes", mensaje); // Enviar mensaje al servidor
        this.inputMessageText = ""; // Limpiar el input
      }
    },
    submitMessage() {
      this.sendMessage(); // Llamar a sendMessage cuando se envíe el formulario
    },
  },
  mounted() {
    this.getUserName();
    // Inicializar el socket
    this.socket = io("http://localhost:8000"); // Asegúrate de cambiar la URL según tu configuración
    this.receiveMessage(); // Llamar al método para recibir mensajes
  },
};
</script>
<style scoped>
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.box {
  width: 400px;
  height: 700px;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
}
.input-div {
  display: flex;
  justify-content: bottom;
  align-items: bottom;
}
</style>
