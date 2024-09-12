import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeViewStudent from "../views/HomeView-Student.vue";
import HomeViewTeacher from "../views/HomeView-Teacher.vue";
import CompRegistro from "@/components/CompRegistro.vue";
import MiLogin from "@/components/MiLogin.vue";
import OlvidoC from "@/components/OlvidoC.vue";
import ActivarCuenta from "@/components/ActivarCuenta.vue";
import CambiarC from "@/components/CambiarC.vue";
import changeCredentials from "@/components/ChangeCredentials.vue";
import profileStudent from "@/components/ProfileView-Student.vue";
import profileTeacher from "@/components/ProfileView-Teacher.vue";
//import ComponenteChat from "@/components/ComponenteChat.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MiLogin,
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
    name: "MiLogin",
    component: MiLogin,
  },
  {
    path: "/registro",
    name: "CompRegistro",
    component: CompRegistro,
  },
  {
    path: "/forgot",
    name: "OlvidoC",
    component: OlvidoC,
  },
  {
    path: "/activateAccount",
    name: "ActivarCuenta",
    component: ActivarCuenta,
  },
  {
    path: "/changePassword",
    name: "CambiarC",
    component: CambiarC,
  },
  {
    path: "/settings",
    name: "changeCredentials",
    component: changeCredentials,
  },
  {
    path: "/profileSt",
    name: "profileStudent",
    component: profileStudent,
  },
  {
    path: "/profileTe",
    name: "profileTeacher",
    component: profileTeacher,
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
