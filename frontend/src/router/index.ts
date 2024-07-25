import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HomeViewStudent from "../views/HomeView-Student.vue";
import HomeViewTeacher from "../views/HomeView-Teacher.vue";
import ComponenteRegistro from "@/components/ComponenteRegistro.vue";
import MiComponenteLogin from "@/components/MiComponenteLogin.vue";
import ComponenteOlvidoC from "@/components/ComponenteOlvidoC.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/home-student",
    name: "home-student",
    component: HomeViewStudent,
  },
  {
    path: "/home-teacher",
    name: "home-teacher",
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
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
