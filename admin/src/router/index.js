import { createRouter, createWebHashHistory } from "vue-router";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useUserStore } from "@/store/index";
import Layout from "@/layout/index.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "/",
        name: "home",
        meta: {
          title: "首页",
        },
        component: () => import("@/page/home/index.vue"),
      },
       {
        path: "/candidate",
        name: "candidate",
        meta: {
          title: "候选人",
        },
        component: () => import("@/page/candidate/index.vue"),
      },
       {
        path: "/election",
        name: "election",
        meta: {
          title: "选举",
        },
        component: () => import("@/page/election/index.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "用户",
        },
        component: () => import("@/page/user/index.vue"),
      },

    
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/page/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/page/404/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  nprogress.start();
  const userStore = useUserStore();
  if (to.meta.requireAuth && !userStore.token) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

router.afterEach(() => {
  nprogress.done();
});
export default router;
