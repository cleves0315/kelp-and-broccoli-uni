import { log, group, groupEnd, groupCollapsed } from './log';

export type IRequestParams = {
  [name: string]: any;
};

export type IRequestResult = {
  code: number;
  message: string;
  data: any;
};

export type IResData = Record<string, any>;

export const baseRequest = async <ResultData = IResData>(params: RQ<ICloud.CallFunctionParam>) => {
  return wx.cloud
    .callFunction(params)
    .then((res) => {
      const { errMsg, result } = res as { errMsg: string; result: IRequestResult };

      if (errMsg !== 'cloud.callFunction:ok') {
        return Promise.reject({ code: result.code, message: '加载失败' });
      }
      if (result.code === 1) {
        groupCollapsed(`request ${params.name} -> success`);
        log('params: ', params);
        log('result: ', result);
        groupEnd();

        return Promise.resolve(result.data as ResultData);
      } else {
        return Promise.reject({ code: result.code, message: result.message });
      }
    })
    .catch((err) => {
      return Promise.reject({ code: -1, message: '加载失败' });
    });
};
