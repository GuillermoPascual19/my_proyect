<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<script>
//import { ref } from "vue";
import SidebarComponent from "./components/complementsApp/SidebarComponent.vue";
import FooterComponent from "./components/complementsApp/FooterComponent.vue";

export default {
  components: {
    SidebarComponent,
    FooterComponent,
  },
};
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  margin-left: 250px; /* Ajusta este valor según el ancho del Sidebar */
}

nav {
  padding: 15px;
  background-color: #f5f5f5;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
