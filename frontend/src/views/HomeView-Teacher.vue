<template>
  <SidebarComponent class="sidebar" />
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey" @click="gotoProfile">
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
          @click="cerrarSesion"
        ></v-btn>
        <span class="text">Close Session</span>
      </router-link>
    </div>
    <div class="botonesAsignaturas">
      <v-dialog v-model="assignDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-pencil"
            color="#4a90e2"
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
import SidebarComponent from "../components/complementsApp/SideBar.vue";
import userService from "../services/user/user.service";
import authService from "../services/auth/auth.service";

export default {
  name: "App",
  data: () => ({
    assignDialog: false,
    unassignDialog: false,
    flagLogged: false,
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
    gotoProfile() {
      if (this.flagLogged === true) {
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
      }
    },
    getUserName() {
      if (this.flagLogged === true) {
        return;
      } else {
        try {
          const typelogin = this.$route.query.typelogin;
          if (typelogin === "google") {
            this.getUserFromGoogle();
            return;
          } else {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
              console.log("User not found, go to login 2");
              console.error("User not found, go to login");
              this.$router.push("/login");
            }
            if (user && user.name && user.surname) {
              this.userName = user.name + " " + user.surname;
              this.flagLogged = true;
            }
          }
        } catch (error) {
          console.error("Error al obtener el nombre del usuario:", error);
          this.userName = "Usuario";
        }
      }
    },
    async getUserFromGoogle() {
      if (this.flagLogged === true) {
        return;
      } else {
        try {
          const typelogin = this.$route.query.typelogin;
          if (typelogin === "manual") {
            this.getUserName();
            return;
          } else {
            if (!localStorage.getItem("user")) {
              const token = this.$route.query.token;
              if (!token) {
                console.error("No token provided, go to login");
                this.$router.push("/login");
                return;
              }
              console.log("Token provided, getting user from Google: ", token);
              const data = await authService.loginGoogle({ idToken: token });
              const user = data.user;
              if (!user) {
                console.log("User not found, go to login 1");
                console.error("User not found, go to login");
                this.$router.push("/login");
              } else {
                console.log("User:", user.name);
                console.log("User logged and saved in localStorage");
                localStorage.setItem("user", JSON.stringify(user));
                this.userName = user.name + " " + user.surname;
                if (user.image) {
                  this.profilePictureUrl = user.image;
                }
                this.flagLogged = true;
              }
            } else {
              const user = JSON.parse(localStorage.getItem("user"));
              this.userName = user.name + " " + user.surname;
              if (user.image) {
                this.profilePictureUrl = user.image;
              }
              console.log("User already logged in and in localStorage");
              this.flagLogged = true;
              return;
            }
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          this.$router.push("/login");
        }
      }
    },
    async assignSubject() {
      if (this.flagLogged === true) {
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
      }
    },
    async unassignSubject() {
      if (this.flagLogged === true) {
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
      }
    },
    async fetchStudents() {
      if (this.flagLogged === true) {
        try {
          const response = await userService.getStudents();

          if (Array.isArray(response.data)) {
            this.students = response.data.map((student) => ({
              name: student.name,
              surname: student.surname,
              email: student.email,
              subjects: student.subjects,
            }));
            this.serverItems = [...this.students];
            this.totalItems = this.students.length;
            this.loading = false;
            console.log("Students loaded correctly");
          } else {
            console.error("Unexpected data format:", response.data);
          }
        } catch (error) {
          console.error(
            "Error al obtener los datos de los alumnos y su asignatura:",
            error
          );
        }
      }
    },
    async cerrarSesion() {
      try {
        await authService.cerrarSesion();
        localStorage.removeItem("user");
        localStorage.clear();
        this.$router.push("/login");
        this.flagLogged = false;
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    async changeCredentials() {
      if (this.flagLogged === true) {
        const user = JSON.parse(localStorage.getItem("user"));
        this.$router.push("/settings?token=" + user.access_token);
      }
    },
    loadItems({ page, itemsPerPage, sortBy, search }) {
      this.loading = true;

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      let items = [...this.students];

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
    this.getUserFromGoogle();
    this.fetchStudents();
  },
  components: {
    SidebarComponent,
  },
};
</script>
<!-- 
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
</style> -->

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f7ef;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar {
  width: 11%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #e8f1e5;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.user-info {
  position: absolute;
  top: 40px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.avatar {
  cursor: pointer;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.1);
}

.fondo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 22%);
  max-width: 1200px;
  background: #ffffff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 80px auto 20px auto;
  position: relative;
}

.btn-refresh {
  position: absolute;
  top: -65px;
  right: 5px;
  background-color: #8ec08f;
  color: #535050;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.btn-refresh:hover {
  background-color: #76a576;
}

.botones {
  position: absolute;
  top: 180px; /* Ajustado para bajar los botones */
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.button .text {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}

.botonesAsignaturas {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 65px;
  margin-top: 40px;
  margin-bottom: 10px; /* Ajustado para bajar más los botones de asignaturas */
}
.assignSubject {
  background-color: #4a90e2; /* Color azul atractivo */
  color: #ffffff; /* Texto blanco */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.assignSubject:hover {
  background-color: #357ab8; /* Color más oscuro al pasar el ratón */
}
body {
  background-color: #e3f2e3;
  color: #333;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

h1 {
  color: #555;
}

.text {
  font-size: 14px;
  color: #333;
}
</style>
