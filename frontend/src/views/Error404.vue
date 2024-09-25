<template>
  <div class="not-found">
    <h1>404 Error</h1>
    <p>La página que estás buscando no existe.</p>
    <button @click="goHome" class="btn-home">
      Volver a la página principal
    </button>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    goHome() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.log("User not found, go to login");
        this.$router.push("/login");
      } else {
        const token = user.access_token;
        if (user.role === 1) {
          this.$router.push("/student?token=" + token);
        } else {
          this.$router.push("/teacher?token=" + token);
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); /* Fuente redondeada */

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
}

h1 {
  font-size: 8rem; /* Tamaño más grande */
  color: #5ecf78; /* Verde */
  font-family: "Poppins", sans-serif; /* Fuente redondeada */
  font-weight: 600;
  margin: 0;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3); /* Sombra de texto */
}

p {
  font-size: 1.5rem;
  color: #333;
}

.btn-home {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-home:hover {
  background-color: #0056b3;
}
</style>
