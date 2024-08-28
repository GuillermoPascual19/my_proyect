import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeViewStudent from "../views/HomeView-Student.vue";
import HomeViewTeacher from "../views/HomeView-Teacher.vue";
import ComponenteRegistro from "@/components/ComponenteRegistro.vue";
import MiComponenteLogin from "@/components/MiComponenteLogin.vue";
import ComponenteOlvidoC from "@/components/ComponenteOlvidoC.vue";
import ComponenteActivarCuenta from "@/components/ComponenteActivarCuenta.vue";
import ComponenteCambiarC from "@/components/ComponenteCambiarC.vue";
//import ComponenteChat from "@/components/ComponenteChat.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MiComponenteLogin,
  },
  {
    path: "/student",
    name: "student",
    component: HomeViewStudent,
  },
  {
    path: "/teacher",
    name: "teacher",
    component: HomeViewTeacher,
  },
  {
    path: "/login",
    name: "MiComponenteLogin",
    component: MiComponenteLogin,
  },
  {
    path: "/registro",
    name: "ComponenteRegistro",
    component: ComponenteRegistro,
  },
  {
    path: "/olvidoContraseña",
    name: "ComponenteOlvidoC",
    component: ComponenteOlvidoC,
  },
  {
    path: "/activarCuenta",
    name: "ComponenteActivarCuenta",
    component: ComponenteActivarCuenta,
  },
  {
    path: "/cambiarContraseña",
    name: "ComponenteCambiarC",
    component: ComponenteCambiarC,
  },
  // {
  //   path: "/teamschat",
  //   name: "ComponenteChat",
  //   component: ComponenteChat,
  // },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
