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
import Error404 from "@/views/Error404.vue";
//import ComponenteChat from "@/components/ComponenteChat.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "MiLogin",
    component: MiLogin,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "MiLogin",
    component: MiLogin,
    meta: { requiresAuth: false },
  },
  {
    path: "/student",
    name: "student",
    component: HomeViewStudent,
    meta: { requiresAuth: false },
  },
  {
    path: "/teacher",
    name: "teacher",
    component: HomeViewTeacher,
    meta: { requiresAuth: false },
  },
  {
    path: "/registro",
    name: "CompRegistro",
    component: CompRegistro,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot",
    name: "OlvidoC",
    component: OlvidoC,
    meta: { requiresAuth: false },
  },
  {
    path: "/activateAccount",
    name: "ActivarCuenta",
    component: ActivarCuenta,
    meta: { requiresAuth: false },
  },
  {
    path: "/changePassword",
    name: "CambiarC",
    component: CambiarC,
    meta: { requiresAuth: false },
  },
  {
    path: "/settings",
    name: "changeCredentials",
    component: changeCredentials,
    meta: { requiresAuth: true },
  },
  {
    path: "/profileSt",
    name: "profileStudent",
    component: profileStudent,
    meta: { requiresAuth: true },
  },
  {
    path: "/profileTe",
    name: "profileTeacher",
    component: profileTeacher,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/teamschat",
  //   name: "ComponenteChat",
  //   component: ComponenteChat,
  // },
  {
    path: "/Error404",
    name: "404",
    component: Error404,
    meta: { requiresAuth: false },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*", // Catch-all route using Vue Router's wildcard
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard to check authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !user.access_token) {
      // If not authenticated, redirect to login
      next({ name: "MiLogin" });
    } else {
      // If authenticated, allow to proceed
      next();
    }
  } else {
    // If the route doesn't require auth, proceed as normal
    next();
  }
});

export default router;
