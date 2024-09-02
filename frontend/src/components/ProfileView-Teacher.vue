<template>
  <div class="app">
    <!-- Mueve el avatar y el nombre fuera del contenedor "fondo" -->
    <div class="user-info">
      <v-avatar class="avatar" size="80" color="grey" @click="gotoProfile">
        <v-img :src="profilePictureUrl"></v-img>
      </v-avatar>
      <span class="user-name">{{ userName }}</span>
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
          @click="cerrarSesion"
        ></v-btn>
        <span class="text">Close Session</span>
      </router-link>
    </div>

    <!-- Contenedor "fondo" -->
    <div class="fondo">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Username</label>
          <label id="username" class="form-input" msg=""></label>
          <span class="username">{{ username }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <label id="name" class="form-input" msg=""></label>
          <span class="name">{{ name }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <label id="surname" class="form-input" msg=""></label>
          <span class="surname">{{ surname }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <label id="dirCorreo" class="form-input" msg=""></label>
          <span class="dirCorreo">{{ dirCorreo }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <label id="role" class="form-input" msg=""></label>
          <span class="role">{{ role }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "../services/user/user.service";
import authService from "../services/auth/auth.service";
// import FileAgent from "vue-file-agent";
// import "vue-file-agent/dist/vue-file-agent.css";

export default {
  data: () => ({
    students: [],
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
  }),
  methods: {
    gotoProfile() {
      this.$router.push("/profile");
    },
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
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
        this.userName = "Usuario"; // Nombre predeterminado en caso de error
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
    async cerrarSesion() {
      try {
        await authService.logout();
        localStorage.removeItem("user");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    async changeCredentials() {
      this.$router.push("/settings");
    },
    // async onFileSelected() {
    //   if (!this.selectedFile || this.selectedFile.length === 0) {
    //     return;
    //   }

    //   const formData = new FormData();
    //   formData.append("image", this.selectedFile[0].file);
    //   formData.append("access_token", "your_access_token_here");

    //   try {
    //     const response = await userService.uploadImage(formData);
    //     this.profilePictureUrl = response.data.imageUrl; // Assuming the server returns the URL of the uploaded image
    //   } catch (error) {
    //     console.error("Error uploading profile picture:", error);
    //   }
    // },
  },
  mounted() {
    this.getUserName();
    this.fetchAsignaturas();
  },
  components: {
    // VueFileAgent: FileAgent,
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90vh;
  background-color: #f8f9fa;
  padding-top: 100px;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
}

.user-name {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.avatar {
  cursor: pointer;
}

.botones {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-decoration: none;
}

.text {
  margin-left: 5px;
  font-size: 14px;
  color: black;
}

.fondo {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
  width: 800px;
  margin-top: 100px; /* Añade un margen superior para que el avatar quede encima */
}

.subjects-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
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
</style>
