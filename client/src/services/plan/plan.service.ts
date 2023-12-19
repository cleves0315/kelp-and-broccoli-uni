import { IPlan } from '@/types/plan';
import { hasServer } from '@/utils/common';
import { request } from '@/utils/request';
import { planStorage } from './plan.storage';

class PlanService {
  public getPlanList = (user_id: string) => {
    if (hasServer()) {
      return request<IPlan[]>('planinfo', { action: 'get', data: { user_id } });
    } else {
      return planStorage.getPlanList();
    }
  };

  public addPlan = (plan: IPlan) => {
    if (hasServer()) {
      return request<null>('planinfo', { action: 'add', data: { plan } }, '', false);
    } else {
      return planStorage.addPlan(plan);
    }
  };

  public delPlan = (number: string) => {
    if (hasServer()) {
      return request<null>('planinfo', { action: 'del', data: { plan_no: number } }, '', false);
    } else {
      return planStorage.delPlan(number);
    }
  };

  public updatePlan = (plan: IPlan) => {
    if (hasServer()) {
      return request<null>('planinfo', { action: 'update', data: { plan } }, '', false);
    } else {
      return planStorage.updatePlan(plan);
    }
  };

  public getTodayBgImg = () => {
    if (hasServer()) {
      return request<string>('planinfo', { action: 'today_bg_img' });
    } else {
      return planStorage.getTodayBgImg();
    }
  };

  /**
   * 
   * @param type — '0' 取消置顶，'1' 置顶
   */
  public setTop = (planNo: string, type: "0" | "1") => {
    if (hasServer()) {
      return Promise.resolve('')
      // return request<string>('planinfo', { action: 'today_bg_img' });
    } else {
      return planStorage.setTop(planNo, type);
    }
  };
}

export const planService = new PlanService();
