import service from '@/api/http';

const loginApi = {
  // 验证登录实例
  postVerification: (path: string, params: object) => service.post(path, params),
};

export default loginApi;
