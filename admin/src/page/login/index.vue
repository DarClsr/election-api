<template>
  <a-row class="h-screen w-full">
    <a-col :span="24"   class="flex justify-center items-center h-full">
      <a-form :model="form" :style="{ width: '400px' }" auto-label-width @submit="handleSubmit">
        <a-space class="flex justify-center">
          <span class="text-4xl font-bold mb-8">投票系统</span>
        </a-space>
        <a-form-item field="username" label="用户名">
          <a-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input v-model="form.password" placeholder="密码" :type="password_type">
            <template #prefix>
              <icon-lock />
            </template>
            <template #suffix>
              <span @click="togglePwd" class="cursor-pointer">
                <icon-eye-invisible v-show="password_type === 'password'"></icon-eye-invisible>
                <icon-eye v-show="password_type === 'text'"></icon-eye>
              </span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button class="w-full" html-type="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
  import { ref } from "vue";
  import {
    IconUser,
    IconLock,
    IconEye,
    IconEyeInvisible,
  } from "@arco-design/web-vue/es/icon";

  import { useUserStore } from "@/store";

  import { useRouter } from "vue-router";

  const form = ref({
    username: "client",
    password: "123456",
  });

  const userStore = useUserStore();

  const router = useRouter();

 

  const password_type = ref("password");
  const togglePwd = () => {
    password_type.value = password_type.value == "password" ? "text" : "password";
  };
  const handleSubmit = async () => {
    await userStore.authLogin({
      email: form.value.username,
      password: form.value.password,
    });
    router.push({
      path: "/",
      name: "home",
    });
  };
</script>
