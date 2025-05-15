import axios from "axios";
import { useUserStore } from "@/store";
import { Message } from "@arco-design/web-vue";
import { setItem } from "../utils/storage";
import router from "../router";
// import { useRouter } from "vue-router";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 统一设置用户身份token
    const user = useUserStore();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
// 统一处理接口响应错误 比如如token过期 服务端异常
http.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const data = error.response?.data;

    if (data && data.statusCode === 401) {
      Message.error("登录失效，请重新登录");
      setItem("token", "");
      const userStore = useUserStore();
      userStore.token = null;

      return router.replace("/login");
    } else {
      let message=data && data.message;
      if(Array.isArray(message)){
        message=message[0]
      }
      Message.error((message) || "请求失败,请稍候重试");
    }

    return Promise.reject(error);
  }
);

export default http;
