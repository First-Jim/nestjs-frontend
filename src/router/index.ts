import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { App } from "vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register/reg.vue"),
  },
] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}
