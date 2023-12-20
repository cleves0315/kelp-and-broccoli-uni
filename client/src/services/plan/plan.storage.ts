import { createPlans } from '@/constants';
import { PlanTypeEnum } from '@/constants/enum';
import { IPlan } from '@/types/plan';
import { getStorageSync, setStorageSync } from '@/utils/storage';

class PlanStorage {
  public getPlanList = (): Promise<IPlan[]> => {
    const planList = getStorageSync('planinfo');

    if (!planList) {
      setStorageSync('planinfo', []);
    } else {
      // 按创建时间排序
      planList.sort((x, y) => y.create_time - x.create_time);
      // 置顶时间排序
      planList.sort((x, y) => (y.top_time || 0) - (x.top_time || 0));
    }

    return Promise.resolve(planList || []);
  };

  public addPlan = (plan: IPlan) => {
    const planList: IPlan[] = getStorageSync('planinfo');

    planList.push(plan);
    try {
      setStorageSync('planinfo', planList);
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
    const planList: IPlan[] = getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === plan_no);

    planList.splice(findIndex, 1);
    setStorageSync('planinfo', planList);

    return Promise.resolve(null);
  };

  public updatePlan = (plan: IPlan) => {
    const planList: IPlan[] = getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === plan.plan_no);

    planList[findIndex] = plan;
    setStorageSync('planinfo', planList);

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
    const planList: IPlan[] = getStorageSync('planinfo') || [];
    const findIndex = planList.findIndex((m) => m.plan_no === planNo);

    if (type === '0') {
      delete planList[findIndex].top_time;
    } else if (type === '1') {
      planList[findIndex].top_time = Date.now(); // 添加置顶时间
    }

    setStorageSync('planinfo', planList);
    return Promise.resolve(null);
  };

  public initPlan = () => {
    const inittedPlans = (() => {
      createPlans({
        title: '使用须知',
        type: PlanTypeEnum.all,
        //         及时性待办清单是什么？
        // 就是你短期内需要完成的事的待办列表。

        // 记住！只写下你短期内要做的事。
        // 长期的待办目标，请记录在其他的笔记软件里。

        // 这么做相比写 todolist 有什么区别？
        // 因为这里只记录你短期内要完成的事情，你能更专注的处理它们。空闲时间就回来扫视下待办列表一并 kill 掉。

        // 举个栗子：
      });
    })();
  };
}

export const planStorage = new PlanStorage();
