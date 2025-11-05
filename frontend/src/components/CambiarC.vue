<template>
  <div class="login">
    <h1 class="title">Change your password</h1>
    <form action class="form" @submit.prevent="changePassword">
      <p class="msg">Write your new password.</p>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">New password</label>
          <input
            v-model="newPassword"
            class="form-input"
            type="password"
            id="newPassword"
            required
            placeholder="New Password"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Repeat password</label>
          <input
            v-model="passwordRepeat"
            class="form-input"
            type="password"
            id="passwordrepeat"
            required
            placeholder="Repeat Password"
          />
        </div>
      </div>

      <input class="form-submit" type="submit" value="Send mail" />
    </form>
  </div>
</template>

<script>
import UserService from "@/services/user.service.ts";

export default {
  data() {
    return {
      password_token: "",
      newPassword: "",
      passwordRepeat: "",
    };
  },
  mounted: function () {
    this.password_token = this.$route.query.token;
  },
  methods: {
    //Enviamos una solicitud POST a la ruta /recover-password del backend con el correo electrónico del usuario.
    //Manejamos el estado de éxito y error para proporcionar retroalimentación al usuario.
    async changePassword() {
      if (!this.password_token) {
        console.log("Password Token is required");
        console.error("Password Token is required");
        this.$router.push("/Error");
      }
      //ValidatePassword
      if (this.newPassword.length < 8) {
        console.log("Password must be at least 8 characters long");
        console.error("Password must be at least 8 characters long");
        return;
      } else if (!/[A-Z]/.test(this.newPassword)) {
        console.log("Password must contain at least one uppercase letter");
        console.error("Password must contain at least one uppercase letter");
        return;
      } else if (!/[a-z]/.test(this.newPassword)) {
        console.log("Password must contain at least one lowercase letter");
        console.error("Password must contain at least one lowercase letter");
        return;
      } else if (!/[0-9]/.test(this.newPassword)) {
        console.log("Password must contain at least one number");
        console.error("Password must contain at least one number");
        return;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) {
        console.log("Password must contain at least one special character");
        console.error("Password must contain at least one special character");
        return;
      }
      if (this.newPassword !== this.passwordRepeat) {
        console.log("Passwords do not match");
        console.error("Passwords do not match");
        return;
      }
      try {
        const response = await UserService.changePassword({
          password_token: this.password_token,
          password: this.newPassword,
          passwordRepeat: this.passwordRepeat,
        });
        if (response.status === 200) {
          alert("Correo enviado");
          this.$router.push("/login");
        }
      } catch (error) {
        console.log(
          "Error: No se ha podido enviar el correo de recuperación de contraseña"
        );
        console.error(
          "Error: No se ha podido enviar el correo de recuperación de contraseña"
        );
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  padding: 4rem;
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
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-top: 1rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 10px 15px;
  margin-bottom: 1rem;
  background: none;
  border: none; /* Cambia esto para el borde blanco */
  color: white;
  border-radius: 5px; /* Opcional: añadir bordes redondeados */
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.9);
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
.error {
  margin: 1rem 0 0;
  color: #ff4a96;
}
.msg {
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 1rem;
  color: white;
}
</style>
