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
      <div class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-wrench"
          @click="changeCredentials"
        ></v-btn>
        <span class="text">Settings</span>
      </div>
      <div class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-exit-to-app"
          @click="logOut"
        ></v-btn>
        <span class="text">Log out</span>
      </div>
    </div>
    <div class="fondo">
      <button class="btn-refresh" @click="fetchAllUsers">
        <v-icon>mdi-refresh</v-icon>
      </button>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="name"
        @update:options="loadItems"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-select
            v-model="item.role"
            :items="roles"
            label="Change Role"
            @change="changeRole(item)"
          ></v-select>
          <v-btn icon @click="deleteUser(item)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>

        <!-- Pie de tabla para buscar por nombre y correo -->
        <template v-slot:footer>
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
      </v-data-table>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../components/complementsApp/SideBar.vue";
import userService from "../services/user.service";
import authService from "../services/auth.service";

export default {
  data: () => ({
    flagLogged: false,
    itemsPerPage: 5,
    search: {
      name: "",
      email: "",
    },
    users: [],
    serverItems: [],
    totalItems: 0,
    userName: "",
    selectedUser: null,
    profilePictureUrl: "https://cdn.vuetifyjs.com/images/john.jpg",
    loading: false,
    roles: ["Teacher", "Student"],
    headers: [
      { title: "Name", key: "name", align: "end" },
      { title: "Surname", key: "surname", align: "end" },
      { title: "Username", key: "username", align: "end" },
      { title: "Email", key: "email", align: "end" },
      { title: "Role", key: "role", align: "end" },
      { title: "Actions", key: "actions", sortable: false },
    ],
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
              this.fetchStudents();
            }
          }
        } catch (error) {
          console.error("Error al obtener el nombre del usuario:", error);
          this.userName = "Usuario";
        }
      }
    },
    loadItems({ page, itemsPerPage, sortBy, search }) {
      this.loading = true;

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      let items = [...this.users];
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
    async changeRole(item) {
      console.log(`Role changed for ${item.name} to ${item.role}`);
      const infoUser = localStorage.getItem("user");
      if (!infoUser) {
        console.log("User not found, please login");
        this.$router.push("/login");
      }
      if (infoUser.role === 1) {
        console.log("User is a student, can't change role");
        return;
      } else {
        console.log("User is a teacher, can change role");
        //mostrar modal de confirmación
        await userService.changeRole(item.email, item.role);
      }
    },
    async deleteUser(item) {
      console.log(`User ${item.name} deleted`);
      const infoUser = localStorage.getItem("user");
      if (!infoUser) {
        console.log("User not found, please login");
        this.$router.push("/login");
      }
      if (infoUser.role === 1) {
        console.log("User is a student, can't change role");
        return;
      } else {
        console.log("User is a teacher, can change role");
        //mostrar modal de confirmación
        await userService.deleteUser(item.email);
      }
    },
    async fetchAllUsers() {
      if (this.flagLogged === true) {
        try {
          const response = await userService.getUsers();

          if (Array.isArray(response.data)) {
            this.users = response.data.map((user) => ({
              name: user.name,
              surname: user.surname,
              username: user.username,
              email: user.email,
              role: user.role === 1 ? "Student" : "Teacher",
            }));
            this.serverItems = [...this.users];
            this.totalItems = this.users.length;
            this.loading = false;
            console.log("Users loaded correctly");
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
  compoments: {
    SidebarComponent,
  },
};
</script>
