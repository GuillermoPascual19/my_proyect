<template>
  <div class="register">
    <h1 class="title">Sign In</h1>
    <form action class="form" @submit="login">
      <label class="form-label">Email:</label>
      <input
        v-model="email"
        class="form-input"
        type="email"
        id="email"
        required
        placeholder="Email"
      />
      <label class="form-label">Password:</label>
      <input
        v-model="password"
        class="form-input"
        type="password"
        id="password"
        required
        placeholder="Password"
      />
      <input class="form-submit" type="submit" value="Sign In" />
    </form>
    <p class="msg">
      ¿No account?
      <router-link to="/registro">Sign up</router-link>
    </p>
    <router-link
      to="/olvidoContraseña"
      class="ms-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
      >Lost Password?</router-link
    >
  </div>
</template>

<script>
import auth from "@/logic/auth";
import { ref } from "vue";

export default {
  data: () => ({
    email: "",
    password: "",
    error: false,
    selected: ref(""),
    roles: [
      { value: "1", name: "Student" },
      { value: "2", name: "Teacher" },
    ],
  }),
  methods: {
    async login() {
      try {
        await auth.login(this.email, this.password);
        const user = {
          email: this.email,
        };
        auth.setUserLogged(user);

        if (this.roles.value == "1") {
          this.$router.push("/home-student");
        } else {
          this.$router.push("/home-teacher");
        }
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    validateNewData() {
      //Password
      if (!this.password.value || this.password.length < 8) {
        this.messageError.value = "Password without enough length";
        console.log(this.messageError);
        return 1;
      } else {
        return 0;
      }
    },
    validEmail(email) {
      const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    submitForm() {
      if (this.validEmail(this.email) && this.validateNewData() != 1) {
        this.emailError = false;
        // Aquí puedes manejar el envío del formulario
        this.login();
      } else {
        this.emailError = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
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
  width: 20%;
  min-width: 450px;
  min-height: 450px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  &:first-of-type {
    margin-top: 0rem;
  }
}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0b9185;
  }
}
.form-row {
  width: 100%;
}
.column-half,
.column-full {
  float: left;
  position: relative;
  padding: 0.65rem;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.button-submit {
  position: inherit;
}
.error {
  margin: 1rem 0 0;
  color: #ff4a96;
}
.msg {
  margin-top: 3rem;
  text-align: center;
}
.remember {
  margin-top: 3rem;
  text-align: center;
  border-radius: 5px;
}
</style>
