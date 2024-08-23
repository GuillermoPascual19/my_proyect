<template>
  <v-app>
    <v-navigation-drawer app permanent color="#35495e" dark width="260">
      <v-list>
        <!-- Logo and Collapse Button -->
        <v-list-item>
          <v-list-item-content>
            <v-icon large>mdi-vuetify</v-icon>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-open</v-icon>
          </v-list-item-action>
        </v-list-item>

        <!-- Main Links -->
        <v-divider></v-divider>
        <v-list-item-group active-class="active-item">
          <v-list-item v-for="item in menuItems" :key="item.title" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    menuItems: [
      { title: "Home", icon: "mdi-home" },
      { title: "About", icon: "mdi-eye" },
      { title: "Team", icon: "mdi-account-group" },
      { title: "Contact", icon: "mdi-email" },
    ],
  }),
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #35495e; /* Fondo oscuro para la barra lateral */
}

.v-list-item-content,
.v-list-item-action {
  color: white; /* Color blanco para el texto e íconos */
}

.v-list-item:hover {
  background-color: #42b983; /* Fondo verde cuando se pasa el cursor */
}

.active-item {
  background-color: #42b983 !important; /* Fondo verde para el elemento activo */
}

.v-list-item-group .v-list-item {
  margin: 5px 0; /* Espaciado entre los elementos del menú */
}

.v-divider {
  margin: 10px 0;
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ); /* Divider con algo de transparencia */
}
</style>
