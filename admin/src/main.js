import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/es/index.less";
import "./style.css";
import { createPinia } from 'pinia'
import { Message } from '@arco-design/web-vue';

import router from "@/router/index.js"

const pinia = createPinia()

const app=createApp(App)

Message._context = app._context;
app.use(pinia).use(router).use(ArcoVue).mount("#app");
