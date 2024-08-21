<template>
  <nav>
    <router-link to="/login">Home</router-link> |
    <router-link to="/home-teacher">Home-Teacher</router-link> |
    <router-link to="/home-student">Home-Student</router-link> |
    <router-link to="/activarCuenta">Activar cuenta</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
