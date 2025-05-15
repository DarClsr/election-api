import http from "@/request/http";

// 获取指定选举的候选人
export const getCandidates = (params) => {
  return http.get(`/candidates`,{
    params
  });
};

export const getCandidateOptions = (params) => {
  return http.get(`/candidates/options`);
};

// 创建候选人
export const createCandidate = (params) => {
  return http.post("/candidates", params);
};

// 更新候选人
export const updateCandidate = (id, params) => {
  return http.put(`/candidates/${id}`, params);
};

// 删除候选人
export const removeCandidate = (id) => {
  return http.delete(`/candidates/${id}`);
};
