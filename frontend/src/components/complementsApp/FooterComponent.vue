<template>
  <v-footer height="auto" class="footer">
    <v-layout justify-center row wrap>
      <v-btn v-for="link in links" :key="link" color="white" flat round>
        {{ link }}
      </v-btn>
      <v-flex class="footer-copyright">
        &copy;2024 — <strong>Vuetify</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"],
  }),
};
</script>

<style scoped>
.footer {
  background-color: #1ab188; /* Color azul similar al de la imagen */
  padding: 0;
  margin-top: auto;
}

.footer-copyright {
  background-color: #49dab3; /* Color azul más claro para la parte inferior */
  color: white;
  text-align: center;
  padding: 10px 0;
  width: 100%;
}
</style>
