<template>
  <div id="app">
    <SidebarComponent class="sidebar" />
    <div class="content">
      <nav>
        <router-link to="/login">Login</router-link> |
        <router-link to="/teacher">Home-Teacher</router-link> |
        <router-link to="/student">Home-Student</router-link> |
        <router-link to="/changeCredentials">changeCredentials</router-link> |
        <router-link to="/profileSt">ProfileStud</router-link> |
        <router-link to="/profileTe">ProfileTeach</router-link>
      </nav>
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import SidebarComponent from "./components/complementsApp/SideBar.vue";

export default {
  name: "App",
  components: {
    SidebarComponent,
  },
};
</script>
<style lang="scss" scoped>
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
// aside {
//   display: flex;
//   flex-direction: column;

//   background-color: var(--dark);
//   color: var(--light);

//   width: calc(2rem + 32px);
//   overflow: hidden;
//   min-height: 100vh;
//   padding: 1rem;

//   transition: 0.2s ease-in-out;

//   .flex {
//     flex: 1 1 0%;
//   }

//   .logo {
//     margin-bottom: 1rem;

//     img {
//       width: 2rem;
//     }
//   }
//   .menu-toggle-wrap {
//     display: flex;
//     justify-content: flex-end;
//     margin-bottom: 1rem;

//     position: relative;
//     top: 0;
//     transition: 0.2s ease-in-out;

//     .menu-toggle {
//       transition: 0.2s ease-in-out;
//       .material-icons {
//         font-size: 2rem;
//         color: var(--light);
//         transition: 0.2s ease-out;
//       }

//       &:hover {
//         .material-icons {
//           color: var(--primary);
//           transform: translateX(0.5rem);
//         }
//       }
//     }
//   }
// }
</style>
