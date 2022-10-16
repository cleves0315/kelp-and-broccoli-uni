import { IPlan } from '@/types/plan';
import { request } from '@/utils/request';

class PlanService {
  public getPlanList = (user_id: string) => {
    return request<IPlan[]>('planinfo', { action: 'get', data: { user_id } });
  };

  public addPlan = (plan: IPlan) => request<null>('planinfo', { action: 'add', data: { plan } }, '', false);

  public delPlan = (number: string) => {
    return request<null>('planinfo', { action: 'del', data: { plan_no: number } }, '', false);
  };

  public updatePlan = (plan: IPlan) =>
    request<null>('planinfo', { action: 'update', data: { plan } }, '', false);

  public getTodayBgImg = () => {
    return request<string>('planinfo', { action: 'today_bg_img' });
  };
}

export const planService = new PlanService();
