import { IPlan, IStep } from '@/types/plan';
import { PlanTypeEnum } from './enum';
import { uuid } from '@/utils/uuid';
import { getGlobalData } from '@/utils/common';

export const defaultPlan: IPlan = {
  plan_no: '',
  user_id: '',
  open_id: '',
  title: '',
  detail: '',
  is_finish: false,
  create_time: 0,
  update_time: 0,
  type: 'all',
  closing_date: 0,
  step_list: [],
  repeat: {},
  finish_date: 0,
  remind_time: 0,
};

export const initStep: IStep = {
  id: '',
  title: '',
  is_finish: false,
};


export interface InitPlansParams extends Partial<Omit<IPlan, 'plan_no' | 'user_id' | 'create_time' | 'update_time'>> {
  title: string;
  type: PlanTypeEnum;
}

export const createPlans = (params: InitPlansParams): IPlan => {
  return Object.assign({
    plan_no: uuid(),
    user_id: getGlobalData('user_id'),
    create_time: Date.now(),
    update_time: Date.now(),
  }, defaultPlan, params);
}
