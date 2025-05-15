import http from "@/request/http";

// 获取所有选举
export const getElections = () => {
  return http.get("/elections");
};

// 创建选举
export const createElection = (params) => {
  return http.post("/elections", params);
};

// 更新选举
export const updateElection = (id, params) => {
  return http.put(`/elections/${id}`, params);
};

// 删除选举
export const removeElection = (id) => {
  return http.delete(`/elections/${id}`);
};

// 控制选举状态（开始/结束）
export const setElectionStatus = (id, status) => {
  return http.patch(`/elections/${id}/status`, { status });
};
