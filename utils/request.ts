import { baseRequest, IRequestParams } from './baseRequest';
import { hasServer } from './common';

export const request = async <ReturnData>(
  url: string,
  params: IRequestParams = {},
  errToast = true,
): Promise<ReturnData> => {
  if (hasServer()) {
    try {
      const data = await baseRequest<ReturnData>({ name: url, data: params, secretType: 'none' });

      return Promise.resolve(data);
    } catch (error) {
      errToast &&
        uni.showToast({
          icon: 'none',
          title: error.message,
        });

      return Promise.reject(error);
    }
  } else {
    // 未开启云端服务
    return Promise.reject('网络请求失败...');
  }
};
