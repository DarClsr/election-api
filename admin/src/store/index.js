import { defineStore } from "pinia";
import { getUserInfo, login, logout } from "../api/auth";
import { getItem, setItem } from "../utils/storage";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref();
  const token = ref(getItem("token") || null);

  const authLogin = async (loginForm) => {
    const { data } = await login(loginForm);
    setItem("token", data.token);
    token.value = data.token;
    user.value = data.user;
  };

  const getProfile = async () => {
    try{
         const { data } = await getUserInfo();
      user.value = data;
    }catch(e){
        
    }
  };

  const logoutUser = async () => {
    console.log("log out");
    await logout();
    setItem("token", "");
    token.value = "";
    user.value = "";
  };

  return {
    user,
    token,
    authLogin,
    getProfile,
    logoutUser,
  };
});
