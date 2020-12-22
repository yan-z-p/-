import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },

  {
    path: "/main",
    name: "Main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("../views/Menu.vue"),
      },
      {
        path: "shopbag",
        name: "Shopbag",
        component: () => import("../views/Shopbag.vue"),
      },
      {
        path: "my",
        name: "My",
        component: () => import("../views/My.vue"),
      },
    ],
  },

  {
    path: "/detail/:pid",
    name: "Detail",
    component: () => import("../views/Detail.vue"),
  },
  {
    path: "/newaddress/:aid?",
    name: "Newaddress",
    component: () => import("../views/Newaddress.vue"),
  },
  {
    path: "/address",
    name: "Address",
    component: () => import("../views/Address.vue"),
  },
  {
    path: "/pay/:sids",
    name: "Pay",
    component: () => import("../views/Pay.vue"),
  },
  {
    path: "/order/:pay?",
    name: "Order",
    component: () => import("../views/Order.vue"),
  },
  {
    path: "/collection",
    name: "Collection",
    component: () => import("../views/Collection.vue"),
  },
  {
    path: "/security",
    name: "Security",
    component: () => import("../views/Security.vue"),
  },
  {
    path: "/personal",
    name: "Personal",
    component: () => import("../views/Personal.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("../views/Forgot.vue"),
  },
  {
    path: '*',
    redirect: {
      name: "Home",
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
