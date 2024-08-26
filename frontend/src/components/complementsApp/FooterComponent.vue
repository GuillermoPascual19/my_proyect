<template>
  <v-footer height="auto" class="footer">
    <v-layout justify-center row wrap>
      <v-flex class="footer-copyright">
        &copy;2024 — <strong>GPM</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.footer {
  padding: 0;
  margin-top: auto;
  max-height: 4.4%;
  width: 100%;
}

.footer-copyright {
  background-color: #fffdfd;
  color: black;
  text-align: right;
  margin-right: 2%;
  padding: 10px 0;
  width: 100%;
  font-size: 15px;
}
</style>
