<template>
  <SidebarComponent class="sidebar" />
  <div class="app">
    <div class="user-info">
      <v-speed-dial location="bottom center" transition="scale-transition">
        <template v-slot:activator="{ props: activatorProps }">
          <span class="user-name">{{ userName }}</span>
          <v-avatar
            class="avatar"
            size="80"
            color="grey"
            v-bind="activatorProps"
          >
            <v-img :src="profilePictureUrl"></v-img>
          </v-avatar>
        </template>
        <div class="button">
          <v-btn
            class="ma-1"
            color="purple"
            variant="tonal"
            icon="mdi-account-cog"
            @click="gotoProfile"
          ></v-btn>
          <span class="text">Profile</span>
        </div>
        <div class="button">
          <v-btn
            class="ma-0"
            color="purple"
            variant="tonal"
            icon="mdi-wrench"
            @click="changeCredentials"
          ></v-btn>
          <span class="text">Settings</span>
        </div>
        <div class="button">
          <v-btn
            class="ma-1"
            color="purple"
            variant="tonal"
            icon="mdi-account-group"
            @click="goToChat"
          ></v-btn>
          <span class="text">Log out</span>
        </div>
        <div class="button">
          <v-btn
            class="ma-1"
            color="purple"
            variant="tonal"
            icon="mdi-exit-to-app"
            @click="logOut"
          ></v-btn>
          <span class="text">Log out</span>
        </div>
      </v-speed-dial>
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
      <button class="btn-refresh" @click="onClick">
        <v-icon>mdi-refresh</v-icon>
      </button>

      <v-card flat class="content-container">
        <v-card-title class="card-title">Students</v-card-title>
        <template v-slot:text>
          <div class="search-fields">
            <v-text-field
              class="mt-2"
              v-model="search.name"
              label="Search name"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
            <v-text-field
              class="mt-2"
              v-model="search.email"
              label="Search email"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </div>
        </template>
        <div class="vertical-divider"></div>
        <div class="table-container">
          <v-data-table
            :headers="headers"
            :items="serverItems"
            :search="search.name || search.email"
            :items-per-page="itemsPerPage"
          ></v-data-table>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../components/complementsApp/SideBar.vue";
import userService from "../services/user.service";
import authService from "../services/auth.service";

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
    // profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    profilePictureUrl: "",
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
  watch: {
    name() {
      this.search = String(Date.now());
    },
    email() {
      this.search = String(Date.now());
    },
  },
  methods: {
    gotoProfile() {
      if (this.flagLogged === true) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.log("User not found, go to login");
          console.error("User not found, go to login");
          this.$router.push("/Error");
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
              this.$router.push("/Error");
            }
            if (user && user.name && user.surname) {
              this.userName = user.name + " " + user.surname;
              this.flagLogged = true;
              this.fetchStudents();
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
              console.log("Data received from Google:", data);
              const user = data.infoUser;
              if (!user) {
                console.log("User not found, go to login 1");
                console.error("User not found, go to login");
                this.$router.push("/login");
              } else {
                console.log("User logged and saved in localStorage");
                localStorage.setItem("user", JSON.stringify(user));
                this.userName = user.name + " " + user.surname;
                if (user.image) {
                  this.profilePictureUrl = user.image;
                }
                this.flagLogged = true;
                this.fetchStudents();
              }
            } else {
              const user = JSON.parse(localStorage.getItem("user"));
              this.userName = user.name + " " + user.surname;
              if (user.image) {
                this.profilePictureUrl = user.image;
              }
              console.log("User already logged in and in localStorage");
              this.flagLogged = true;
              this.fetchStudents();
              return;
            }
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          this.$router.push("/Error");
        }
      }
    },
    async assignSubject() {
      if (this.flagLogged === true) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.log("User not found, go to login");
          console.error("User not found, go to login");
          this.$router.push("/Error");
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
            access_token: user.access_token,
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
          this.$router.push("/Error");
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
          console.log(response.message);
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
          this.$router.push("/Error");
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
            console.log(
              "Students loaded correctly, total items:",
              this.totalItems
            );
          } else {
            console.error("Unexpected data format:", response.data);
          }
        } catch (error) {
          console.error(
            "Error al obtener los datos de los alumnos y su asignatura:",
            error
          );
          this.$router.push("/Error");
        }
      }
    },
    async logOut() {
      try {
        const infoUser = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("user");
        console.log("Cerrando sesión para el usuario con id:", infoUser.id);
        const access_token = infoUser.access_token;
        console.log("Access token:", access_token);
        await authService.logOut(access_token);
        this.$router.push("/login");
        this.flagLogged = false;
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        this.$router.push("/Error");
      }
    },
    goToChat() {
      if (this.flagLogged === true) {
        //const user = JSON.parse(localStorage.getItem("user"));
        this.$router.push("/chat"); // + user.access_token);
      }
    },
    async changeCredentials() {
      if (this.flagLogged === true) {
        const user = JSON.parse(localStorage.getItem("user"));
        this.$router.push("/settings?token=" + user.access_token);
      }
    },
    onClick() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
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
  margin-top: 20px;
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

.testing {
  cursor: pointer;
  transition: transform 0.3s;
  left: -1500px;
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
  height: 500px;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 80px auto 20px auto;
  margin-top: 40px;
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
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ma-1:hover,
.ma-0:hover {
  color: #46c01e;
  transform: scale(1.1);
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
  margin-top: 160px;
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

.content-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  height: 100%;
  max-width: 1200px;
}

.card-title {
  position: absolute;
  top: -20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.v-card-text {
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  height: 10px;
}
.search-fields {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 80%;
  margin-top: 80px;
}

.table-container {
  width: 65%;
  height: 100%;
}

.vertical-divider {
  width: 1px;
  background-color: #ccc;
  height: 100%;
}
</style>
