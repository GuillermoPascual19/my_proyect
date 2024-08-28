<template>
  <div id="app">
    <SidebarComponent class="sidebar" />
    <div class="content">
      <nav>
        <router-link to="/login">Home</router-link> |
        <router-link to="/teacher">Home-Teacher</router-link> |
        <router-link to="/student">Home-Student</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
      <div class="main-content">
        <router-view />
      </div>
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
  min-width: 100%;
}

.sidebar {
  width: 11%;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 10px;
  overflow-y: auto;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
