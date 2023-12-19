import { IPlan } from '@/types/plan';
import { log } from '@/utils/log';

class PlanStorage {
  public getPlanList = (): Promise<IPlan[]> => {
    const planList = uni.getStorageSync('planinfo');

    if (!planList) {
      uni.setStorageSync('planinfo', []);
    }

    // 按创建时间排序
    planList.sort((x, y) => y.create_time - x.create_time);
    // 置顶时间排序
    planList.sort((x, y) => (y.top_time || 0) - (x.top_time || 0));

    return Promise.resolve(planList || []);
  };

  public addPlan = (plan: IPlan) => {
    const planList: IPlan[] = uni.getStorageSync('planinfo');

    planList.push(plan);
    try {
      uni.setStorageSync('planinfo', planList);
    } catch (error) {
      // 超过最大缓存容量10MB
      uni.showModal({
        content: '当前缓存空间已占满，请手动清除部分数据',
        showCancel: false,
        confirmText: '知道了',
      });
      return Promise.reject(null);
    }

    return Promise.resolve(null);
  };

  public delPlan = (plan_no: string) => {
    const planList: IPlan[] = uni.getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === plan_no);

    planList.splice(findIndex, 1);
    uni.setStorageSync('planinfo', planList);

    return Promise.resolve(null);
  };

  public updatePlan = (plan: IPlan) => {
    const planList: IPlan[] = uni.getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === plan.plan_no);

    planList[findIndex] = plan;
    uni.setStorageSync('planinfo', planList);

    return Promise.resolve(null);
  };

  public getTodayBgImg = () => {
    return Promise.resolve('https://i.328888.xyz/2023/01/12/lGIiz.jpeg');
  };

  /**
   * 
   * @param type '0' 取消置顶，'1' 置顶
   */
  public setTop = (planNo: string, type: '0' | '1') => {
    const planList: IPlan[] = uni.getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === planNo);

    if (type === '0') {
      delete planList[findIndex].top_time;
    } else if (type === '1') {
      planList[findIndex].top_time = Date.now(); // 添加置顶时间
    }

    uni.setStorageSync('planinfo', planList);
    return Promise.resolve(null);
  };
}

export const planStorage = new PlanStorage();
