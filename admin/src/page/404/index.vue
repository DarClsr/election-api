<template>
   <div class="text-center relative flex flex-col items-center w-[400px] h-[400px] mt-20  mx-auto">
        <img  src="@/assets/images/error-img.png" class="w-full absolute" />>
        <h1 class="display-1 fw-semibold relative">4<span class="text-primary mx-2">0</span>4</h1>
        <h4 class="text-uppercase">Sorry, page not found</h4>
        <div class="mt-5 text-center">
          <a-button type="primary" size="large" @click="goHome">返回首页</a-button>
        </div>
      </div>
</template>
<script  setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.replace("/");
};
</script>

<style scoped>
.page {
  overflow: hidden;
}
.display-1 {
  font-size: calc(1.725rem + 5.7vw);
  color: #495057;
}
.full-img {
  width: 100%;
  height: auto;
}
</style>
