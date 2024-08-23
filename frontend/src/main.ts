import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "../node_modules/flowbite-vue/dist/index.css"; // Adjusted import path
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Ensure you import Vuetify styles
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Create a Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(router).use(vuetify).mount("#app");
