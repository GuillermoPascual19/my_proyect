<template>
  <div id="app">
    <SidebarComponent class="sidebar" />
    <div class="content">
      <nav>
        <router-link to="/login">Home</router-link> |
        <router-link to="/home-teacher">Home-Teacher</router-link> |
        <router-link to="/home-student">Home-Student</router-link> |
        <router-link to="/activarCuenta">Activar cuenta</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
      <router-view />
      <FooterComponent />
    </div>
  </div>
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
  min-width: 100%;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  margin-left: 50px; /* Ajusta este valor según el ancho del Sidebar */
}

nav {
  padding: 15px;
  background-color: #7bd8bf;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 10px;
}

nav a.router-link-exact-active {
  color: #e70e0e;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

.sidebar {
  max-width: 11%;
}
</style>
