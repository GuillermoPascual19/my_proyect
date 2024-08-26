<template>
  <div class="register">
    <h1 class="title">Sign In</h1>
    <div>
      <form action class="form" @submit="login">
        <label class="form-label">Username:</label>
        <input
          v-model="username"
          class="form-input"
          type="text"
          id="username"
          required
          placeholder="Username"
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
    </div>
    <div class="mensajes">
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
  </div>
</template>

<script>
import auth from "@/services/auth/auth.service";

export default {
  data: () => ({
    username: "",
    password: "",
    error: false,
  }),
  methods: {
    async login() {
      if (!this.username || !this.password) {
        console.log("Username and password are required");
        console.error("Username and password are required");
        return;
      }
      //ValidatePassword
      if (this.password.length < 8) {
        console.log("Password must be at least 8 characters long");
        console.error("Password must be at least 8 characters long");
        return;
      } else if (!/[A-Z]/.test(this.password)) {
        console.log("Password must contain at least one uppercase letter");
        console.error("Password must contain at least one uppercase letter");
        return;
      } else if (!/[a-z]/.test(this.password)) {
        console.log("Password must contain at least one lowercase letter");
        console.error("Password must contain at least one lowercase letter");
        return;
      } else if (!/[0-9]/.test(this.password)) {
        console.log("Password must contain at least one number");
        console.error("Password must contain at least one number");
        return;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        console.log("Password must contain at least one special character");
        console.error("Password must contain at least one special character");
        return;
      }
      //Funcionality
      try {
        const user = await auth.login({
          username: this.username,
          password: this.password,
        });
        //auth.setUserLogged(user);

        if (user.role.value == "1") {
          this.$router.push("/home-student");
        } else {
          this.$router.push("/home-teacher");
        }
      } catch (error) {
        console.log(error);
        this.error = true;
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
  margin-top: 4%;
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
.remember {
  margin-top: 3rem;
  text-align: center;
  border-radius: 5px;
}
.mensajes {
  flex-direction: column;
  align-items: center; /* Center the content horizontally */
  justify-content: center; /* Center the content vertically */
  text-align: center;
  margin-top: 2rem; /* Adjust this value as needed for spacing */
  padding: 1rem;
}
</style>
