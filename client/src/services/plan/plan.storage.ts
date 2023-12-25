import { createPlans, latestNotice, wiki } from '@/constants';
import { PlanNoEnum } from '@/constants/enum';
import { IPlan } from '@/types/plan';
import { getStorageSync, setStorageSync } from '@/utils/storage';
import { uuid } from '@/utils/uuid';
import isEmpty from 'lodash/isEmpty';

class PlanStorage {
  public getPlanList = (): Promise<IPlan[]> => {
    const planList = getStorageSync('planinfo');

    if (!planList) {
      setStorageSync('planinfo', []);
    } else {
      // 按创建时间排序
      planList.sort((x, y) => y.create_time - x.create_time);
      // 置顶时间排序
      // planList.sort((x, y) => (y.top_time || 0) - (x.top_time || 0));
    }

    return Promise.resolve(planList || []);
  };

  public addPlan = async (plan: IPlan) => {
    const planList = await this.getPlanList();

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

  public delPlan = async (plan_no: string) => {
    const planList = await this.getPlanList();
    const findIndex = planList.findIndex((m) => m.plan_no === plan_no);

    planList.splice(findIndex, 1);
    setStorageSync('planinfo', planList);

    return Promise.resolve(null);
  };

  public updatePlan = async (plan: IPlan) => {
    const planList = await this.getPlanList();
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
  public setTop = async (planNo: string, type: '0' | '1') => {
    const planList = await this.getPlanList();
    const findIndex = planList.findIndex((m) => m.plan_no === planNo);

    if (type === '0') {
      delete planList[findIndex].top_time;
    } else if (type === '1') {
      planList[findIndex].top_time = Date.now(); // 添加置顶时间
    }

    setStorageSync('planinfo', planList);
    return Promise.resolve(null);
  };

  public initialPlan = () => {
    const initialPlans = (() => {
      return createPlans({
        plan_no: PlanNoEnum.wiki,
        title: '使用建议',
        detail: wiki,
        type: 'notice',
        top_time: Date.now(),
      });
    })();

    this.addPlan(initialPlans);
  };

  public addNoticePlan = async () => {
    if (!isEmpty(latestNotice)) {
      const noticePlans = (() => {
        return createPlans({
          plan_no: uuid(),
          title: latestNotice.title,
          detail: latestNotice.detail,
          type: 'notice',
          top_time: Date.now(),
        });
      })();

      this.addPlan(noticePlans);
    }
  };
}

export const planStorage = new PlanStorage();
