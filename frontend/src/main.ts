import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "../node_modules/flowbite-vue/dist/index.css"; // Adjusted import path
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Ensure you import Vuetify styles
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import "./assets/tailwind.css"; // Import Tailwind CSS
import VueFileAgentNext from "@boindil/vue-file-agent-next";

import "@boindil/vue-file-agent-next/dist/vue-file-agent-next.css";

// Create a Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
});

createApp(App).use(router).use(vuetify).use(VueFileAgentNext).mount("#app");
