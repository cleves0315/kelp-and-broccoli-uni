import { IPlan, IStep } from '@/types/plan';

export const initPlan: IPlan = {
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
