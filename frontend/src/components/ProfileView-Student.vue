<template>
  <SidebarComponent class="sidebar" />
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey">
        <v-img :src="profilePictureUrl"></v-img>
      </v-avatar>
    </div>
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
          @click="logOut"
        ></v-btn>
        <span class="text">Close Session</span>
      </router-link>
    </div>

    <div class="fondo">
      <h1 class="title">Teacher</h1>
      <table class="subjects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Alumno</th>
            <th>Apellidos del Alumno</th>
            <th>Email del Alumno</th>
            <th>Asignatura</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.surname }}</td>
            <td>{{ student.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import SidebarComponent from "../components/complementsApp/SideBar.vue";
import userService from "../services/user.service";
import authService from "../services/auth.service";

export default {
  data: () => ({
    students: [],
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
  }),
  methods: {
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          this.$router.push("/login");
        }
        if (user && user.name && user.surname) {
          this.userName = user.userName + " ";
          this.name = user.name + "";
          this.surname = user.surname + "";
          this.email = user.email + "";
          this.role = user.rol + "";
        } else {
          this.userName = "Usuario";
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        this.userName = "Usuario";
      }
    },
    async fetchAsignaturas() {
      try {
        const response = await userService.getStudents();
        this.students.value = response.data;
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    },
    async logOut() {
      try {
        await authService.logOut();
        localStorage.removeItem("user");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    async changeCredentials() {
      this.$router.push("/settings");
    },
  },
  mounted() {
    this.getUserName();
    this.fetchAsignaturas();
  },
  components: {
    SidebarComponent,
  },
};
</script>
<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90vh;
  background-color: #f1f7ef;
  margin: 0;
  padding-top: 100px;
}
.sidebar {
  width: 11%;
}
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #4dc753;
  margin-bottom: 20px;
}
.subtitle {
  color: #45a049;
}
.user-info {
  position: absolute;
  top: 70px;
  right: 40px;
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.avatar {
  margin-left: 10px;
}
.fondo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 900px;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 55px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
  margin-top: 80px;
}
.btn-refresh {
  position: absolute;
  top: 20px;
  right: 55px;
  background-color: #8ec08f;
  color: rgb(83, 80, 80);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.botones {
  position: absolute;
  top: 160px;
  right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}

.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  text-decoration: none;
}
.botonesAsignaturas {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

body {
  background-color: #ffffff;
  color: #333;
  font-family: Arial, sans-serif;
}

h1 {
  color: #555;
}

.text {
  margin-top: 5px;
  font-size: 14px;
  color: black;
}
</style>
