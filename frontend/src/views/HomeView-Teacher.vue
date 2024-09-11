<template>
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey" @click="gotoProfile">
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
    <div class="botonesAsignaturas">
      <!-- Dialog for Assign Subject -->
      <v-dialog v-model="assignDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-pencil"
            color="green"
            variant="tonal"
            v-bind="activatorProps"
          >
            Assign Subject
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Assign Subject</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email*"
                  v-model="email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Subject*"
                  v-model="subject"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Close"
              variant="plain"
              @click="assignDialog = false"
            ></v-btn>
            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="
                assignSubject();
                assignDialog = false;
              "
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog for Unassign Subject -->
      <v-dialog v-model="unassignDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-delete"
            color="red"
            variant="tonal"
            v-bind="activatorProps"
          >
            Unassign Subject
          </v-btn>
        </template>

        <v-card>
          <v-card-title>Unassign Subject</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email*"
                  v-model="emailUnassign"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Subject*"
                  v-model="subjectUnassign"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Close"
              variant="plain"
              @click="unassignDialog = false"
            ></v-btn>
            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="
                unassignSubject();
                unassignDialog = false;
              "
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="fondo">
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
            <td>
              <v-text-field
                v-model="search.email"
                @input="loadItems"
                class="ma-2"
                density="compact"
                placeholder="Search email..."
                hide-details
              ></v-text-field>
            </td>
          </tr>
        </template>
      </v-data-table-server>
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
    assignDialog: false,
    unassignDialog: false,
    email: "",
    subject: "",
    emailUnassign: "",
    subjectUnassign: "",
    students: [],
    selectedFile: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    userName: "",
    itemsPerPage: 5,
    headers: [
      { title: "Name", key: "name", align: "end" },
      { title: "Surname", key: "surname", align: "end" },
      { title: "Email", key: "email", align: "end" },
      { title: "Subject", key: "subjects", align: "end" },
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    name: "",
    search: {
      name: "",
      email: "",
    },
  }),
  methods: {
    updateSearch() {
      console.log("Search updated:", this.search);
    },
    gotoProfile() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.log("User not found, go to login");
        console.error("User not found, go to login");
        this.$router.push("/login");
      }
      if (user.role === 1) {
        this.$router.push("/profileSt?token=" + user.access_token);
      } else {
        this.$router.push("/profileTe?token=" + user.access_token);
      }
    },
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
    async assignSubject() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.log("User not found, go to login");
        console.error("User not found, go to login");
        return;
      }
      if (!this.email || !this.subject) {
        console.log("All fields are required");
        return;
      }
      const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.email.length < 8) {
        console.log("Email without enough length");
        return;
      }
      if (!re.test(this.email)) {
        console.log(
          "Email incorrect! must contain at least one special character"
        );
        return;
      }
      console.log("All fields are correct and validated correctly");
      try {
        const response = await userService.assignSubject({
          id: user.id,
          email: this.email,
          subject: this.subject,
        });
        console.log(response.message);
        this.message = response.message;
        this.assignDialog = false;
        this.email = "";
        this.subject = "";
        this.fetchStudents();
      } catch (error) {
        console.log("Server Error:", error);
        this.message = error.response
          ? error.response.data.message
          : "Server error";
      }
    },
    async unassignSubject() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!this.emailUnassign || !this.subjectUnassign) {
        console.log("All fields are required");
        return;
      }
      const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.emailUnassign.length < 8) {
        console.log("Email without enough length");
        return;
      }
      if (!re.test(this.emailUnassign)) {
        console.log(
          "Email incorrect! must contain at least one special character"
        );
        return;
      }
      console.log("All fields are correct and validated correctly");
      try {
        const response = await userService.unassignSubject({
          id: user.id,
          email: this.emailUnassign,
          subject: this.subjectUnassign,
        });
        console.log(response);
        this.message = response.message;
        this.unassignDialog = false;
        this.emailUnassign = "";
        this.subjectUnassign = "";
        this.fetchStudents();
      } catch (error) {
        console.log("Server Error:", error);
        this.message = error.response
          ? error.response.data.message
          : "Server error";
      }
    },
    async fetchStudents() {
      try {
        const response = await userService.getStudents();

        if (Array.isArray(response.data)) {
          this.students = response.data.map((student) => ({
            name: student.name,
            surname: student.surname,
            email: student.email,
            subjects: student.subjects,
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
    // loadItems({ page, itemsPerPage, sortBy }) {
    //   this.loading = true;

    //   const start = (page - 1) * itemsPerPage;
    //   const end = start + itemsPerPage;
    //   let items = [...this.students];

    //   if (this.search.name) {
    //     items = items.filter((student) =>
    //       student.name.toLowerCase().includes(this.search.name.toLowerCase())
    //     );
    //   }
    //   if (this.search.email) {
    //     items = items.filter((student) =>
    //       student.email.toLowerCase().includes(this.search.email.toLowerCase())
    //     );
    //   }
    //   if (sortBy.length) {
    //     const sortKey = sortBy[0].key;
    //     const sortOrder = sortBy[0].order;

    //     items.sort((a, b) => {
    //       const aValue = a[sortKey];
    //       const bValue = b[sortKey];
    //       return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    //     });
    //   }
    //   const paginatedItems = items.slice(start, end);
    //   this.serverItems = paginatedItems;
    //   this.totalItems = items.length;
    //   this.loading = false;
    // },
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
  margin: 0;
  padding-top: 100px;
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
