<template>
  <div class="app">
    <div class="user-info">
      <v-avatar class="avatar" size="80" color="grey">
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

    <div class="content-wrapper">
      <div class="fondo">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Username: </label>
            <label id="username" class="form-input"></label>
            <span class="valores"> {{ username }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Name: </label>
            <label id="name" class="form-input"></label>
            <span class="valores"> {{ name }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name: </label>
            <label id="surname" class="form-input"></label>
            <span class="valores"> {{ surname }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Email: </label>
            <label id="dirCorreo" class="form-input"></label>
            <span class="valores"> {{ dirCorreo }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Role: </label>
            <label id="role" class="form-input"></label>
            <span class="valores"> {{ role }}</span>
          </div>
        </div>
      </div>

      <div class="fondo2">
        <button class="btn-refresh" @click="fetchStudents">
          <v-icon>mdi-refresh</v-icon>
        </button>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="name"
          @update:options="loadItems"
        >
          <template v-slot:tfoot>
            <tr>
              <td>
                <v-text-field
                  v-model="search.name"
                  @input="loadItems"
                  class="ma-2"
                  density="compact"
                  placeholder="Search name..."
                  hide-details
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
      <div class="fileSelector">
        <input
          type="file"
          class="input-subject"
          @change="onFileSelected"
          accept="image/*"
        />
      </div>
    </div>
  </div>
</template>

<script>
import userService from "../services/user/user.service";
import authService from "../services/auth/auth.service";
import FileAgent from "vue-file-agent";
import "vue-file-agent/dist/vue-file-agent.css";

export default {
  data: () => ({
    students: [],
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
    itemsPerPage: 5,
    headers: [
      { title: "Name subject", key: "subject_name", align: "end" },
      { title: "Number of students", key: "num_students", align: "end" },
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    name: "",
    search: {
      subject_name: "",
    },
  }),
  methods: {
    getUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          this.username = user.username + " ";
          this.userName = user.name + " " + user.surname;
          this.name = user.name + "";
          this.surname = user.surname + "";
          this.dirCorreo = user.email + "";
          this.role = user.role + "";
        } else {
          this.userName = "Usuario";
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        this.userName = "Usuario";
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
      const user = JSON.parse(localStorage.getItem("user"));
      this.$router.push("/settings?token=" + user.access_token);
    },
    async fetchStudents() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await userService.getNumStudentsPerSubject(user.id);

        if (Array.isArray(response.data)) {
          this.students = response.data.map((subject) => ({
            subject_name: subject.subject_name,
            num_students: subject.num_students,
          }));
          console.log("Students2:", this.students);
          this.serverItems = [...this.students];
          this.totalItems = this.students.length;
          this.loading = false;
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error(
          "Error al obtener los datos de los alumnos y su asignatura:",
          error
        );
      }
    },
    loadItems({ page, itemsPerPage, sortBy, search }) {
      this.loading = true;

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      let items = [...this.students];

      console.log("Funciona", this.search);
      // Búsqueda
      if (search.name) {
        items = items.filter((student) =>
          student.name.toLowerCase().includes(search.name.toLowerCase())
        );
      }
      if (search.email) {
        items = items.filter((student) =>
          student.email.toLowerCase().includes(search.email.toLowerCase())
        );
      }

      // Ordenación
      if (sortBy.length) {
        const sortKey = sortBy[0].key;
        const sortOrder = sortBy[0].order;

        items.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      const paginatedItems = items.slice(start, end);
      this.serverItems = paginatedItems;
      this.totalItems = items.length;
      this.loading = false;
    },
    async onFileSelected() {
      if (!this.selectedFile || this.selectedFile.length === 0) {
        return;
      }

      const formData = new FormData();
      formData.append("image", this.selectedFile[0].file);
      formData.append("access_token", "your_access_token_here");

      try {
        const response = await userService.uploadImage(formData);
        this.profilePictureUrl = response.data.imageUrl; // Assuming the server returns the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    },
  },
  async fetch({ page, itemsPerPage, sortBy, search }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let items = this.students.slice();

        this.loadItems({ page, itemsPerPage, sortBy, search });

        const paginated = items.slice(start, end);
        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
  mounted() {
    this.getUserName();
    this.fetchStudents();
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
  background-color: #f1f7ef;
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  text-decoration: none;
}

.text {
  margin-top: 5px;
  font-size: 14px;
  color: black;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1400px;
}

.fondo {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
  width: 500px;
  height: 200px;
  margin-top: 100px;
}

.form-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.form-label {
  text-align: right;
  color: white;
  font-style: italic;
  padding-right: 20px;
}

.valores {
  background-color: white;
  padding: 5px 10px;
  border-radius: 5px;
  color: black;
  border: 1px solid #ccc;
  text-align: left;
}

.fondo2 {
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
</style>
