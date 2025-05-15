import http from "@/request/http";

// 获取所有用户
export const getUsers = (params) => {
  return http.get("/users",{
    params
  });
};

