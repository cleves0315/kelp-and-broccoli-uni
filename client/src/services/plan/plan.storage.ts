import { IPlan } from '@/types/plan';

class PlanStorage {
  public getPlanList = (): Promise<IPlan[]> => {
    const planList = uni.getStorageSync('planinfo');

    if (!planList) {
      uni.setStorageSync('planinfo', []);
    }

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
}

export const planStorage = new PlanStorage();
