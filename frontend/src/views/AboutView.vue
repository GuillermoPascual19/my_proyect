<template>
  <v-layout text-center wrap>
    <v-flex mb-4>
      <h1 class="display-2 font-weight-bold">Welcome to the Vue Example!</h1>
      <p class="subheading font-weight-regular">
        This is a simple example of a Vue.js frontend with Vue. ¿por qué no va
        mi icono? Pues ni idea.
      </p>
    </v-flex>

    <v-flex xs12>
      <v-img
        :src="require('../assets/logoUSAL.png')"
        class="my-3"
        contain
        height="1000"
      ></v-img>
    </v-flex>
  </v-layout>
</template>

<script>
export default {};
</script>

<style scoped>
h1 {
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 50px;
  font-weight: 800;
}
</style>
