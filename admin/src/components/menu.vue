<template>
  <div class="h-[100%] flex flex-col overflow-hidden">
    <div class="logo mb-2 items-center flex justify-center font-bold">投票系统</div>
    <a-menu :default-selected-keys="selectPaths" @menu-item-click="clickMenu">
      <a-menu-item v-for="item in menus" :key="item.path">
         <component :is="item.icon" ></component>
         <span class="w-[50px] inline-block">
          {{ item.name }}
         </span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { useMenu } from "@/hook/useMenu";
import { IconHome } from "@arco-design/web-vue/es/icon";
import { computed } from "vue";
import { useRoute } from "vue-router";

const { menus, clickMenu } = useMenu();

const route = useRoute();

const selectPaths = computed(() => {
  const select_path = route.matched[1];
  return [select_path?.path || ""];
});
</script>

<style lang="css" scoped>
.menu-list {
  padding: 0 40px;
}
.logo {
  width: 200px;
  height: 64px;
  border-radius: 2px;
  background: var(--color-fill-3);
  cursor: text;
}

.menu-content :deep(.arco-menu-inner .arco-menu-overflow-wrap) {
  display: flex;
  align-items: center;
}

.menu-content :deep(.arco-menu-inner .arco-menu-overflow-wrap .arco-menu-item) {
  display: flex;
  align-items: center;
  width: 120px;
  justify-content: center;
}
</style>
