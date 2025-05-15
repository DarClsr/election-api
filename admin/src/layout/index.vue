<template>
  <a-layout class="layout-main relative">
    <a-layout-sider collapsible breakpoint="xl">
      <Menu class="" />
    </a-layout-sider>
    <a-layout-content class="layout-content">
      <a-layout-header class="bg-white dark:bg-slate-800">
        <div class="w-full h-100 flex items-center flex-row">
          <div class="user-content mx-2 mr-5 sm:hidden md:block ml-auto">
            <a-dropdown class="text-center">
              <div class="nickname">
                <a-avatar>
                  <img
                    alt="avatar"
                    src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                  />
                </a-avatar>
              </div>
              <template #content>
                <a-doption class="flex w-full justify-center">
                  <span>{{ userInfo.username }}</span>
                </a-doption>
                <a-doption @click="handleClick"> 退出登录 </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="bg-gray-100  p-2">
        <router-view v-slot="{ Component }" :key="$route.fullPath">
          <transition name="animation" mode="out-in" appear>
            <component :is="Component"></component>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import Menu from "@/components/Menu.vue";
import { IconMoonFill, IconSunFill } from "@arco-design/web-vue/es/icon";
import { computed, onMounted, provide } from "vue";
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useUserStore();

const userInfo = computed(() => store.user);

const handleClick = async () => {
  await store.logoutUser();
  router.replace({
    path: "login",
  });
};

onMounted(() => {
  store.getProfile();
});
</script>

<style scoped>
.layout-main {
  width: 100%;
  height: 100%;
}

.layout-main :deep(.arco-layout-header),
.layout-main :deep(.arco-layout-footer),
.layout-main :deep(.arco-layout-sider-children),
.layout-main :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* color: var(--color-white); */
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
  /* height: calc(100vh - 64px); */
}

.layout-main :deep(.arco-layout-content) {
  /* padding-top: 78px;
  overflow-y: scroll; */
  height: calc(100vh - 68px);
  /* overflow-y: scroll */
}

.layout-main :deep(.arco-layout-header),
.layout-main :deep(.arco-layout-footer) {
  height: 64px;
  /* border-bottom:1px solid rgb(var(--color-fill-3)) ; */
}

.layout-main :deep(.arco-layout-header) {
  position: sticky;
  top: 0;
  z-index: 1;
}

.animation-enter-from,
.animation-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.animation-enter-to,
.animation-leave-from {
  opacity: 1;
}
.animation-enter-active {
  transition: all 0.7s ease;
}
.animation-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}
</style>
