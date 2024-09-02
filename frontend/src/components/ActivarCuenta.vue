<template>
  <div class="app">
    <div class="fondo">
      <h1 class="title">¡Activa tu cuenta!</h1>
      <div class="form-group">
        <label class="form-label" for="access_token">
          Introduce tu access Token:
        </label>
        <input
          class="form-input"
          type="text"
          id="access_token"
          v-model="access_token"
        />
      </div>
      <button class="btn-add" @click="activateAccount">Activar cuenta</button>
    </div>
  </div>
</template>

<script>
import userService from "../services/user/user.service";

export default {
  data: () => ({
    access_token: "",
  }),
  methods: {
    async activateAccount() {
      if (!this.access_token) {
        console.log("access_token is required");
        console.error("access_token is required");
      }
      try {
        const response = await userService.activateAccount({
          access_token: this.access_token,
        });
        const user = response.data;
        console.log("Usuario activado: ", user);
        this.$router.push("/login");
      } catch (error) {
        console.log("Error al activar la cuenta :");
        console.error("Error al activar la cuenta :");
      }
    },
  },
};
</script>

<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh; /* Full viewport height */
  background-color: #f8f9fa;
  margin: 0;
}
html,
body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.fondo {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 800px;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #45a049;
  margin-bottom: 20px;
}

body {
  background-color: #f0f0f0;
  color: #333;
  font-family: Arial, sans-serif;
}

h1 {
  color: #555;
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
  text-align: center;
}

.form-input {
  padding: 10px 15px;
  margin-bottom: 3rem;
  margin-left: 8rem;
  margin-right: 8rem;
  background: none;
  border: none;
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.9);
}

.btn-add {
  padding: 5px 10px;
  margin-left: 11rem;
  margin-right: 11rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background-color: #45a049;
}
</style>
