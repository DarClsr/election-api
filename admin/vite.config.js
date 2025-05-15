import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),tailwindcss()],
  server:{
    port:5050
  },
   // 路径别名配置
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
})
