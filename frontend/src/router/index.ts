import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "../stores/app";
// Import your components here
// @ts-ignore
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Notes from "../views/Dashboard.vue";
import Home from '../views/Index.vue'
import SongPage from '../views/SongView.vue'
const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Notes,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/signup",
    name: "Sign Up",
    component: SignUp,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/s/:id",
    name: "Song",
    component: SongPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const sessionId = localStorage.getItem("sessionId");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

 console.log('sessionid',sessionId)

  if (requiresAuth && !sessionId) {
    // User is not logged in and the route requires authentication
    next({ name: "Sign In" });
  } else if (sessionId && (to.name === "Sign In" || to.name === "Sign Up")) {
    // User is already logged in and trying to access sign-in or sign-up pages
    next({ name: "Notes" });
  } else {
    // User is either authenticated or not accessing a protected route
    next();
  }
});

export default router;
