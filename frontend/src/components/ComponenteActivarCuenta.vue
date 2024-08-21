<template>
  <div class="fondo">
    <h1 class="title">Activa tu cuenta!</h1>
    <div class="form-group">
      <label class="form-label" for="access_token"
        >Introduce tu access Token:
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
</template>

<script>
import { ref } from "vue";
import userService from "../services/user/user.service";

export default {
  setup() {
    const user = ref([]);
    const access_token = ref("");
    const activateAccount = async () => {
      try {
        const response = await userService.activateAccount({
          access_token: this.access_token,
        });
        user.value = response.data;
        if (user.value.role === "1") {
          this.$router.push("/student");
        } else if (user.value.role === "2") {
          this.$router.push("/teacher");
        }
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    return {
      access_token,
      activateAccount,
      user,
    };
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #45a049;
  margin-bottom: 5rem;
  position: relative;
}
.fondo {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 800px;
  min-height: 500px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
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
}

.form-input,
.form-select {
  padding: 10px 15px;
  margin-bottom: 3rem;
  margin-left: 8rem;
  margin-right: 8rem;
  background: none;
  border: none; /* Cambia esto para el borde blanco */
  color: white;
  border-radius: 5px; /* Opcional: añadir bordes redondeados */
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
