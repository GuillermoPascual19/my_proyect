<template>
  <div class="register">
    <h1 class="title">Sign In</h1>
    <div>
      <form action class="form" @submit.prevent="login">
        <label class="form-label">Email:</label>
        <input
          v-model="email"
          class="form-input"
          type="text"
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
        <p class="error" v-if="error">{{ errorMesage }}</p>
        <div class="signinG">
          <button @click="loginGoogle" class="button google">
            <v-icon left>mdi-google</v-icon> Sign in with Google
          </button>
        </div>
      </form>
    </div>
    <div class="mensajes">
      <p class="msg">
        ¿No account?
        <router-link to="/registro">Sign up</router-link>
      </p>
      <router-link
        to="/forgot"
        class="ms-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >Lost Password?</router-link
      >
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service.ts";

export default {
  data: () => ({
    email: "",
    password: "",
    error: false,
    errorMesage: "",
  }),
  methods: {
    async login() {
      if (!this.email || !this.password) {
        console.log("email and password are required");
        console.error("email and password are required");
        this.error = true;
        this.errorMesage = "email and password are required";
        return;
      }
      //ValidatePassword
      if (this.password.length < 8) {
        console.log("Password must be at least 8 characters long");
        console.error("Password must be at least 8 characters long");
        this.error = true;
        this.errorMesage = "Password must be at least 8 characters long";
        return;
      } else if (!/[A-Z]/.test(this.password)) {
        console.log("Password must contain at least one uppercase letter");
        console.error("Password must contain at least one uppercase letter");
        this.error = true;
        this.errorMesage =
          "Password must contain at least one uppercase letter";
        return;
      } else if (!/[a-z]/.test(this.password)) {
        console.log("Password must contain at least one lowercase letter");
        console.error("Password must contain at least one lowercase letter");
        this.error = true;
        this.errorMesage =
          "Password must contain at least one lowercase letter";
        return;
      } else if (!/[0-9]/.test(this.password)) {
        console.log("Password must contain at least one number");
        console.error("Password must contain at least one number");
        this.error = true;
        this.errorMesage = "Password must contain at least one number";
        return;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        console.log("Password must contain at least one special character");
        console.error("Password must contain at least one special character");
        this.error = true;
        this.errorMesage =
          "Password must contain at least one special character";
        return;
      }
      //Funcionality
      try {
        const response = await AuthService.login({
          username: this.username,
          password: this.password,
        });
        //auth.setUserLogged(user);
        const infoUser = response.infoUser;
        const userToken = response.data.loginToken;
        localStorage.setItem("user", JSON.stringify(infoUser));
        if (infoUser.role == "1") {
          this.$router.push(
            "/student?token=" + userToken + "&typelogin=manual"
          );
        } else if (infoUser.role == "2") {
          this.$router.push(
            "/teacher?token=" + userToken + "&typelogin=manual"
          );
        }
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    async loginGoogle() {
      try {
        window.location.href = "http://localhost:3000/api/google";
      } catch (error) {
        console.error(error);
        this.error = true;
        this.errorMesage = "Error in Google Sign In";
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
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
}
.signinG {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem 0;
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  cursor: pointer;
}

.button.google {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #4285f4; /* Azul Google */
  border: none;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #357ae8; /* Azul Google más oscuro para el hover */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.5); /* Enfocado */
  }

  &:active {
    background-color: #3367d6; /* Azul Google aún más oscuro */
  }

  img {
    margin-right: 0.5rem;
    width: 20px;
    height: 20px;
  }
}
</style>
