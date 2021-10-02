import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Room from "../views/Room.vue";
import CheckIn from "../views/CheckIn.vue";
import Chat from "../views/Chat.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/room",
    name: "Room",
    component: Room,
  },
  {
    path: "/checkin/:host_id/:room_id",
    name: "CheckIn",
    component: CheckIn,
  },
  {
    path: "/chat/:host_id/:room_id",
    name: "Chat",
    component: Chat,
  },
  {
    path: "*",
    redirect: "/",
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
