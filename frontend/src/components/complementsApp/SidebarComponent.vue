<template>
  <v-app>
    <v-navigation-drawer app permanent color="#35495e" dark width="260">
      <v-list>
        <!-- Logo and Collapse Button -->
        <v-list-item>
          <v-list-item-content>
            <v-icon large>mdi-vuetify</v-icon>
          </v-list-item-content>
          <v-list-item-action click>
            <v-icon>mdi-menu-open</v-icon>
          </v-list-item-action>
        </v-list-item>

        <!-- Main Links -->
        <v-divider></v-divider>
        <v-list-item-group active-class="active-item">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            link
            @click="redirectTo"
          >
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
      { title: "Home", icon: "mdi-home", route: "/" },
      { title: "About Us", icon: "mdi-eye", route: "/about" },
      { title: "TeamsChat", icon: "mdi-account-group", route: "/teamschat" },
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
  justify-content: center;
  text-align: center;
}

.v-list-item-group .v-list-item {
  cursor: pointer; /* Cambia el cursor al pasar por encima de los elementos */
  justify-content: center;
  text-align: center;
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
