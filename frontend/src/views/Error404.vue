<template>
  <div class="not-found">
    <div class="titulo">
      <h1>404</h1>
      <h1 class="error">Error</h1>
    </div>
    <p>File not found.</p>
    <v-btn @click="goHome" class="btn-home" color="red" variant="tonal">
      Redirect
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    goHome() {
      this.$router.push("/");
    },
    // goHome() {
    //   const user = JSON.parse(localStorage.getItem("user"));
    //   if (!user) {
    //     console.log("User not found, go to login");
    //     this.$router.push("/login");
    //   } else {
    //     const token = user.access_token;
    //     if (user.role === 1) {
    //       this.$router.push("/student?token=" + token);
    //     } else {
    //       this.$router.push("/teacher?token=" + token);
    //     }
    //   }
    // },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); /* Fuente redondeada */

.titulo {
  flex-direction: row;
  display: flex;
  gap: 5px;
  justify-content: center;
}

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ccc6c6;
  text-align: center;
}

h1 {
  font-size: 16rem; /* Tamaño más grande */
  color: #cf3b3b; /* Verde */
  font-family: "Poppins", sans-serif; /* Fuente redondeada */
  font-weight: 600;
  margin: 0;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3); /* Sombra de texto */
}

.error {
  font-size: 5rem; /* Tamaño más grande */
  color: #cf3b3b; /* Verde */
  font-family: "Poppins", sans-serif; /* Fuente redondeada */
  font-weight: 600;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3); /* Sombra de texto */
}

p {
  font-size: 3.5rem;
  color: #b64949;
}

.btn-home {
  margin-top: 20px;
  padding: 10px 20px 35px 20px;
  font-size: 1.1rem;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-home:hover {
  background-color: #cf3b3b;
}
</style>
