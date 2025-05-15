import {
  IconCloud,
  IconHome,
  IconUser,
  IconUserAdd,
} from "@arco-design/web-vue/es/icon";
import { markRaw, ref } from "vue";
import { useRouter } from "vue-router";
export const useMenu = () => {
  const menus = ref([
    {
      name: "首页",
      path: "/",
      key: "home",
      icon: markRaw(IconHome),
    },
    {
      name: "候选人",
      path: "/candidate",
      key: "candidate",
      icon: markRaw(IconUserAdd),
    },
    {
      name: "选举",
      path: "/election",
      key: "election",
      icon: markRaw(IconCloud),
    },
    {
      name: "用户",
      path: "/user",
      key: "user",
      icon: markRaw(IconUser),
    },
  ]);

  const router = useRouter();

  const clickMenu = (path) => {
    router.push({
      path,
    });
  };

  return {
    menus,
    clickMenu,
  };
};
