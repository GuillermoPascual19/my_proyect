<template>
  <div class="login">
    <h1 class="title">¿Forgot your password?</h1>
    <form action class="form" @submit.prevent="login">
      <p class="msg">Write your email and we will contact you.</p>
      <label class="form-label">Email</label>
      <input
        v-model="username"
        class="form-input"
        type="email"
        id="username"
        required
        placeholder="Email"
      />

      <p v-if="error" class="error">Has introducido mal el usuario</p>
      <input class="form-submit" type="submit" value="Enviar correo" />
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      error: false,
      errorMessage: "",
      success: false,
      successMessage: "",
    };
  },
  methods: {
    //Enviamos una solicitud POST a la ruta /recover-password del backend con el correo electrónico del usuario.
    //Manejamos el estado de éxito y error para proporcionar retroalimentación al usuario.
    async recoverPassword() {
      try {
        const response = await fetch("http://localhost:3000/recover-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email }),
        });

        if (!response.ok) {
          throw new Error("No se pudo enviar el correo de recuperación");
        }

        this.success = true;
        this.successMessage = "Correo de recuperación enviado correctamente";
        this.error = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        this.success = false;
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
  width: 20%;
  min-width: 400px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 1rem;
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
