import http from "@/request/http";

export const login = (params) => {
  return http.post("/auth/login", params);
};

export const getUserInfo = (params) => {
  return http.get("auth/profile", params);
};

export const logout=() => {
  return http.get("auth/logout");
};
