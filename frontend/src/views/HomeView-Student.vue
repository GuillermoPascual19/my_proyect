<template>
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey">
        <v-img :src="profilePictureUrl"></v-img>
      </v-avatar>
    </div>
    <!-- File Upload -->
    <!-- <vue-file-agent
      v-model="selectedFile"
      @select="onFileSelected"
      multiple
    ></vue-file-agent> -->
    <div class="botones">
      <router-link to="/settings" class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-wrench"
          @click="changeCredentials"
        ></v-btn>
        <span class="text">Settings</span>
      </router-link>
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

    <div class="fondo">
      <h1 class="title">Student</h1>
      <h3 class="subtitle">Asignaturas</h3>
      <table class="subjects-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Nombre de la Asignatura</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in subjects" :key="subject.id">
            <td>{{ subject.name_teacher }}</td>
            <td>{{ subject.surname_teacher }}</td>
            <td>{{ subject.email_teacher }}</td>
            <td>{{ subject.name_subject }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import userService from "../services/user/user.service";
import authService from "../services/auth/auth.service";

export default {
  data: () => ({
    subjects: [],
    user_id: "",
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
  }),
  methods: {
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name && user.surname) {
          this.userName = user.name + " " + user.surname;
          this.user_id = user.id;
        } else {
          this.userName = "Usuario";
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        this.userName = "Usuario"; // Nombre predeterminado en caso de error
      }
    },
    async cerrarSesion() {
      try {
        await authService.logout();
        localStorage.removeItem("user");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    async fetchSubjects() {
      try {
        const response = await userService.getSubjectsByStudent(this.user_id);
        this.subjects.email_teacher = response.data.subject_email;
        this.subjects.name_subject = response.data.subject_name;
        this.subjects.name_teacher = response.data.name_teacher;
        this.subjects.surname_teacher = response.data.surname_teacher;
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    },
  },
  mounted() {
    this.getUserName();
    this.fetchSubjects();
  },
};
</script>
<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh; /* Full viewport height */
  background-color: #f8f9fa;
  margin: 0;
  padding-top: 100px; /* Añade espacio para el navbar */
}
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #4dc753;
  margin-bottom: 20px;
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

.fondo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center content horizontally */
  width: 800px;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
body {
  background-color: #f0f0f0;
  color: #333;
  font-family: Arial, sans-serif;
}
.text {
  margin-top: 5px; /* Espacio entre el icono y el texto */
  font-size: 14px;
  color: black;
}
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #45a049;
  margin-bottom: 20px;
}

.subjects-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subjects-table th,
.subjects-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.subjects-table th {
  background-color: #e0e0e0;
}

.subjects-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.subjects-table tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

.form-container {
  margin-top: 20px;
}
</style>
