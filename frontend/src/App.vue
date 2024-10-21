<template>
  <div id="app">
    <div class="content">
      <!-- <nav>
        <router-link to="/student">Home-Student</router-link> |
        <router-link to="/profileSt">ProfileStud</router-link> |
        <router-link to="/profileTe">ProfileTeach</router-link> |
        <router-link to="/Error404">404</router-link> |
        <router-link to="/chat">Chat</router-link> |
      </nav> -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

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
  flex-direction: column;
  min-width: 100%;
  height: 100%;
  background-color: #f1f7ef;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
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
