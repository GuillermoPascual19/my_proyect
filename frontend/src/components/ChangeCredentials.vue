<template>
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey">
        <v-img :src="profilePictureUrl"></v-img>
      </v-avatar>
    </div>
    <div class="botones">
      <router-link to="/login" class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-exit-to-app"
          @click="cerrarSesion"
        ></v-btn>
        <span class="text">Close Session</span>
      </router-link>
    </div>
    <h1 class="title" msg=""></h1>
    <form class="form">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input
            v-model="name"
            class="form-input"
            type="text"
            id="name"
            required
            placeholder="Nombre"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input
            v-model="surname"
            class="form-input"
            type="text"
            id="apellidos"
            required
            placeholder="Apellidos"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            class="form-input"
            type="text"
            id="email"
            required
            placeholder="Email"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <flowbite-themable :theme="theme">
            <fwb-select
              text="Role"
              class="form-select"
              v-model="selected"
              required
              :options="rolesOpt"
            >
            </fwb-select>
          </flowbite-themable>
        </div>
        <div class="form-group full-width">
          <v-btn class="ma-2" color="green" @click="ChangeInfo">
            Accept
            <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
          </v-btn>
          <v-btn class="ma-2" color="red" @click="cancelChange">
            Decline
            <v-icon icon="mdi-cancel" end></v-icon>
          </v-btn>
        </div>
      </div>
    </form>
    <p v-if="errorMessage.length > 0">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { FwbSelect } from "flowbite-vue";
import userService from "../services/user/user.service";
import authService from "../services/auth/auth.service";

export default {
  name: "ComponenteRegistro",
  //Data
  data: () => ({
    name: "",
    email: "",
    surname: "",
    accessToken: "3rhb23uydb238ry6g2429hrh",
    selected: "",
    rolesOpt: [
      { value: "1", name: "Student" },
      { value: "2", name: "Teacher" },
    ],
    rol: "",
    theme: "dark",
    subjects: [],
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
    errorMessage: "",
  }),
  //Components
  components: {
    FwbSelect,
  },
  //Methods
  methods: {
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name && user.surname) {
          this.userName = user.name + " " + user.surname;
        } else {
          this.userName = "Usuario";
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        this.userName = "Usuario"; // Nombre predeterminado en caso de error
      }
    },
    gotoProfile() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.log("User not found, go to login");
        console.error("User not found, go to login");
        this.$router.push("/login");
      }
      if (user && user.role === 1) {
        this.$router.push("/profileSt?token=" + user.access_token);
      } else {
        this.$router.push("/profileTe?token=" + user.access_token);
      }
    },
    async changeInfo() {
      if (!this.name || !this.surname || !this.email || !this.selected) {
        console.log("All fields are required");
        this.errorMessage.value = "All fields are required";
        return;
      }
      //ValidateEmail
      const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.email.length < 8) {
        console.log("Email without enough length");
        this.errorMessage.value = "Email without enough length";
        return;
      }
      if (!re.test(this.email)) {
        console.log(
          "Email incorrect! must contain at least one special character"
        );
        this.errorMessage.value =
          "Email incorrect! must contain at least one special character";
        return;
      }
      console.log("All fields are correct and validated correctly");
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.log("User not found");
          this.errorMessage.value = "User not found";
          return;
        }
        if (this.selected === "") {
          this.selected = user.role;
        } else if (this.name === "") {
          this.name = user.name;
        } else if (this.surname === "") {
          this.surname = user.surname;
        } else if (this.email === "") {
          this.email = user.email;
        }
        this.rol = this.selected;
        const response = await userService.changeCredentials({
          name: this.name,
          surname: this.surname,
          email: this.email,
          role: this.selected,
          id: user.id,
        });
        if (user.role === "1") {
          this.$router.push("/student?token=" + user.access_token);
        } else {
          this.$router.push("/teacher?token=" + user.access_token);
        }
        console.log(response);
        this.message = response.message;
      } catch (error) {
        console.log("Server Error:", error);
        this.message = error.response
          ? error.response.data.message
          : "Server error";
      }
    },
    cancelChange() {
      this.name = "";
      this.surname = "";
      this.email = "";
      this.selected = "";
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.log("User not found");
        this.errorMessage.value = "User not found";
        this.$router.push("/login");
        return;
      }
      if (user.role === "1") {
        this.$router.push("/student?token=" + user.access_token);
      } else {
        this.$router.push("/teacher?token=" + user.access_token);
      }
    },
    async cerrarSesion() {
      try {
        await authService.logout();
        localStorage.removeItem("user");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        this.errorMessage = "Error al cerrar sesión";
      }
    },
  },
  mounted() {
    this.getUserName();
  },
  props: {
    msg: String,
  },
};
</script>
<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column; /* Asegura que los elementos se organicen en columna */
  align-items: center;
  justify-content: flex-start; /* Mantiene los elementos alineados al inicio de la columna */
  min-height: 90vh;
  background-color: #f8f9fa;
  margin: 0;
  padding-top: 100px;
}

.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  min-width: 700px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.fileSelector {
  margin-top: 20px; /* Asegura que haya espacio entre el formulario y este contenedor */
  width: 40%;
  min-width: 700px;
  max-width: 100%;
  background: #ffffff; /* Opcional: un fondo diferente */
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 50px;
  font-weight: 800;
}
.user-info {
  position: absolute;
  top: 70px; /* Ajusta según el tamaño del navbar */
  right: 40px;
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 10px; /* Espacio entre el nombre y el avatar */
  font-size: 18px;
  font-weight: bold;
  color: #333; /* Color del texto del nombre del usuario */
}

.avatar {
  margin-left: 10px;
}
.botones {
  position: absolute;
  top: 160px; /* Coloca los botones debajo del avatar */
  right: 40px;
  display: flex;
  flex-direction: column; /* Organiza los botones en columna */
  justify-content: flex-start; /* Alinea los botones al inicio de la columna */
  align-items: center;
  margin-top: 20px;
}

.button {
  display: flex;
  flex-direction: column; /* Alinea el icono y el texto en columna */
  align-items: center;
  margin-bottom: 10px; /* Espacio entre los botones */
  text-decoration: none; /* Elimina el subrayado de los enlaces */
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

.form-label {
  margin-top: 1rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 10px 15px;
  margin-bottom: 1rem;
  background: none;
  border: none; /* Cambia esto para el borde blanco */
  color: white;
  border-radius: 5px; /* Opcional: añadir bordes redondeados */
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.9);
}

.form-input:focus,
.form-select:focus {
  outline: 0;
  border-color: #1ab188;
}

.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}

.form-submit:hover {
  background: #0b9185;
}
</style>
