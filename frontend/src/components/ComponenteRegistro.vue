<template>
  <div class="register">
    <h1 class="title">Register</h1>
    <form class="form" @submit.prevent="registerUser">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Username</label>
          <input
            v-model="username"
            class="form-input"
            type="text"
            id="username"
            required
            placeholder="PepitoGrillo19"
          />
        </div>
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
          <label class="form-label">Password</label>
          <input
            v-model="password"
            class="form-input"
            type="password"
            id="password"
            required
            placeholder="Password"
            rules="required|min:6"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Repite la contraseña:</label>
          <input
            v-model="passwordRepeat"
            class="form-input"
            type="password"
            id="password-repeat"
            required
            placeholder="Password"
            rules="required|confirmed:password"
          />
        </div>
        <div class="form-group">
          <label class="form-label-role">Role</label>
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
          <p v-if="error" class="error">
            Has introducido mal el usuario o la contraseña
          </p>
        </div>
        <p v-if="error" class="error">
          Has introducido mal el usuario o la contraseña
        </p>
        <div class="form-group full-width">
          <input class="form-submit" type="submit" value="Register" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { FwbSelect } from "flowbite-vue";
//import { ref } from "vue";
import authService from "../services/auth/auth.service";

export default {
  name: "ComponenteRegistro",
  //Data
  data: () => ({
    username: "",
    name: "",
    email: "",
    surname: "",
    password: "",
    passwordRepeat: "",
    error: false,
    accessToken: "3rhb23uydb238ry6g2429hrh",
    selected: "",
    rolesOpt: [
      { value: "1", name: "Student" },
      { value: "2", name: "Teacher" },
    ],
    rol: "",
    theme: "dark",
  }),
  //Components
  components: {
    FwbSelect,
  },
  //Methods
  methods: {
    async registerUser() {
      console.log(this.username);
      console.log(this.name);
      console.log(this.surname);
      console.log(this.email);
      console.log(this.password);
      console.log(this.passwordRepeat);
      console.log(this.selected);
      if (
        !this.username ||
        !this.name ||
        !this.surname ||
        !this.email ||
        !this.password ||
        !this.selected
      ) {
        console.log("All fields are required");
        return;
      }

      if (this.password !== this.passwordRepeat) {
        console.log("Passwords do not match");
        return;
      }
      //Email
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
      //Password
      if (this.password.length < 8) {
        console.log("Password must be at least 8 characters long");
        return;
      } else if (!/[A-Z]/.test(this.password)) {
        console.log("Password must contain at least one uppercase letter");
        return;
      } else if (!/[a-z]/.test(this.password)) {
        console.log("Password must contain at least one lowercase letter");
        return;
      } else if (!/[0-9]/.test(this.password)) {
        console.log("Password must contain at least one number");
        return;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        console.log("Password must contain at least one special character");
        return;
      }
      console.log("All fields are correct and validated correctly");
      try {
        this.rol = this.selected;
        const response = await authService.register({
          username: this.username,
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
          role: this.rol,
        });
        if (this.rol === "1") {
          this.$router.push("/home-student");
        } else {
          this.$router.push("/home-teacher");
        }
        this.message = response.data.message;
      } catch (error) {
        console.log("ServerError:", error);
        this.message = error.response
          ? error.response.data.message
          : "Server error";
      }
    },
  },
  props: {
    msg: String,
  },
};
</script>
<style lang="scss" scoped>
.register {
  padding: 2rem;
}

.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 50px;
  font-weight: 800;
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

.error {
  color: #ff4a96;
}

.remember {
  text-align: center;
  border-radius: 5px;
}
</style>
