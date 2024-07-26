<template>
  <div class="register">
    <h1 class="title">Register</h1>
    <form class="form" @submit.prevent="register">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
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
          <label class="form-label" for="nombre">Name</label>
          <input
            v-model="nombre"
            class="form-input"
            type="text"
            id="nombre"
            placeholder="Nombre"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="apellidos">Last Name</label>
          <input
            v-model="apellidos"
            class="form-input"
            type="text"
            id="apellidos"
            placeholder="Apellidos"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input
            v-model="email"
            class="form-input"
            type="text"
            id="email"
            placeholder="Email"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            v-model="password"
            class="form-input"
            type="password"
            id="password"
            placeholder="Password"
            rules="required|min:6"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="password-repeat"
            >Repite la contraseña:</label
          >
          <input
            v-model="passwordRepeat"
            class="form-input"
            type="password"
            id="password-repeat"
            placeholder="Password"
            rules="required|confirmed:password"
          />
        </div>
        <div class="form-group">
          <label class="form-label-role" for="role">Role</label>
          <flowbite-themable :theme="theme">
            <fwb-select
              text="Role"
              class="form-select"
              v-model="selected"
              required
              :options="roles"
            >
            </fwb-select>
          </flowbite-themable>
        </div>
        <div class="form-group full-width">
          <p v-if="error" class="error">
            Has introducido mal el usuario o la contraseña
          </p>
        </div>
        <div class="form-group full-width">
          <input class="form-submit" type="submit" value="Register" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import auth from "@/logic/auth.js";
import { FwbSelect } from "flowbite-vue";
import { ref } from "vue";

export default {
  name: "ComponenteRegistro",
  //Data
  data: () => ({
    username: "",
    nombre: "",
    email: "",
    apellidos: "",
    password: "",
    passwordRepeat: "",
    error: false,
    messageError: "",
    selected: ref(""),
    roles: [
      { value: "1", name: "Student" },
      { value: "2", name: "Teacher" },
    ],
  }),
  //Components
  components: {
    FwbSelect,
  },
  //Methods
  methods: {
    async register() {
      try {
        await auth.register(this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        this.error = true;
        console.log(error);
      }
    },
    validateNewData() {
      //Password
      if (!this.password.value || this.password.length < 8) {
        this.messageError.value = "Password without enough length";
        console.log(this.messageError);
        return;
      }
      if (!/[A-Z]/.test(this.password.value)) {
        this.messageError.value =
          "Password must contain at least one uppercase letter";
        return;
      }
      if (!/[a-z]/.test(this.password.value)) {
        this.messageError.value =
          "Password must contain at least one lowercase letter";
        return;
      }
      if (!/[0-9]/.test(this.password.value)) {
        this.messageError.value = "Password must contain at least one number";
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password.value)) {
        this.messageError.value =
          "Password must contain at least one special character";
        return;
      }
      //PasswordRepeat
      if (
        !this.passwordRepeat.value ||
        this.passwordRepeat.length < 8 ||
        this.password.match(this.passwordRepeat.value)
      ) {
        this.messageError.value = "Password without enough length";
        console.log(this.messageError);
        return;
      }
      //Name
      if (!this.name.value || this.name.length < 1) {
        this.error = true;
        this.messageError.value = "Name must contain at least one character";
        console.log(this.messageError);
      }
      //Email
      const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!this.email.value || this.email.length < 8) {
        this.messageError = "Email without enough length";
        console.log(this.messageError);
        return;
      }
      if (!re.test(this.email.value)) {
        this.messageError.value =
          "Email incorrect! must contain at least one special character";
        console.log(this.messageError);
        return;
      }
      //Username
      if (!this.username.value || this.username.length < 1) {
        this.error = true;
        this.messageError.value =
          "Username must contain at least one character";
        console.log(this.messageError);
      }
      //LastName
      if (!this.apellidos.value || this.apellidos.length < 1) {
        this.error = true;
        this.messageError.value =
          "Last Name must contain at least one character";
        console.log(this.messageError);
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
