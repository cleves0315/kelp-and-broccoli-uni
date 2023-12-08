import { NodeEnvEnum } from '@/constants/enum';
import { cloudEnvMap } from '@/constants/enum-map';
import { getGlobalDataParams, IGlobalData } from '@/types/global';

const app = getApp({ allowDefault: true });

export const getNodeEnv = () => {
  return process.env.NODE_ENV as NodeEnvEnum;
};

/** 获取运行时平台环境 */
export const getRunningEnv = () => {
  return uni.getSystemInfoSync().uniPlatform;
};

/**
 * 使用云开发
 */
export const hasServer = () => {
  return false;
};

/**
 * 初始化云函数
 */
export const initCloud = () => {
  if (hasServer()) {
    const cloudEnv = cloudEnvMap[getNodeEnv()];
    wx.cloud.init({
      env: cloudEnv,
      traceUser: true,
    });
    // 这里指云函数初始化结束，不一定代表初始化成功(env：id 无效也会成功执行)
    return Promise.resolve('云函数初始化结束');
  } else {
    return Promise.reject('当前未开启云开发请求');
  }
};

/**
 * 判断 iphone10 以上机型
 */
export const isIphone = () => {
  const { model } = uni.getSystemInfoSync();
  return /iphone[\s]?((x|x[rs])|1[1-9])/.test(model.toLowerCase());
};

/**
 * 设置全局数据
 * - 该变量数据不具有响应式
 */
export const setGlobalData = (data: IGlobalData) => {
  const keys = Object.getOwnPropertyNames(data);

  if (!app.global) {
    app.global = {};
  }

  keys.forEach((key) => {
    app.global[key] = data[key];
  });
};

/**
 * 获取全局数据
 * - 该变量数据不具有响应式
 */
export const getGlobalData = (key: getGlobalDataParams) => {
  if (key && typeof key === 'string') {
    return app?.global?.[key];
  }
  return undefined;
};

/**
 * 发起订阅消息
 */
export const requestSubscribeMessage = async (tmplIds: string[]) => {
  try {
    // 发起订阅
    const res = await new Promise((res, rej) => {
      uni.requestSubscribeMessage({
        tmplIds,
        success: res,
        fail: rej,
      });
    });

    const result = res[tmplIds[0]]; // 获取用户操作结果

    // 'accept'同意、'reject'拒绝、'ban'被封禁、'filter'同名被过滤
    if (result === 'accept') {
      return Promise.resolve();
    } else {
      return Promise.reject('用户拒绝授权');
    }
  } catch (error) {
    if (error.errCode === 20004) {
      // 用户关闭了主开关，无法订阅
      uni.openSetting({
        withSubscriptions: true,
        fail: () => {
          uni.showToast({
            icon: 'none',
            title: '操作失败，请打开小程序设置开启通知',
          });
        },
      });
    } else {
      uni.showToast({
        icon: 'none',
        title: '操作失败，请稍后再试',
      });
    }
    return Promise.reject(error);
  }
};

/**
 * 显示指定时间的小时和分钟数
 * @return string '00:00'
 */
export const showHourseAndMinute = (date: Date | number | string) => {
  let hourse: number | string = new Date(date).getHours();
  let minute: number | string = new Date(date).getMinutes();

  if (hourse < 10) {
    hourse = '0' + hourse;
  } else {
    hourse = '' + hourse;
  }
  if (minute < 10) {
    minute = '0' + minute;
  } else {
    minute = '' + minute;
  }

  return `${hourse}:${minute}`;
};
