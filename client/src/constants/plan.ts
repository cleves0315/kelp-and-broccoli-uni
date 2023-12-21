import { IPlan, IStep } from '@/types/plan';
import { getGlobalData } from '@/utils/common';
import { uuid } from '@/utils/uuid';
import { PlanTypeEnum } from './enum';

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

export interface InitPlansParams
  extends Partial<Omit<IPlan, 'plan_no' | 'user_id' | 'create_time' | 'update_time'>> {
  plan_no?: string;
  title: string;
  type: PlanTypeEnum;
}

export const createPlans = (params: InitPlansParams): IPlan => {
  const staticField = {
    plan_no: params.plan_no || uuid(),
    user_id: getGlobalData('user_id'),
    create_time: Date.now(),
    update_time: Date.now(),
  };
  return Object.assign({}, defaultPlan, staticField, params);
};

export const wiki = `——及时性待办清单是什么？\n
——就是你短期内要做事情的待办列表。\n\n
记住！这里只写下你短期内要做的事。\n
长期的待办目标，请记录在其他的笔记软件里！\n\n\n
例如：\n
·了解 stable diffusion
· 在下午 15:00 去公园跑步
· 17:00 超市酸奶特价
· 小程序完成审核\n
以上都是记录一些可能遗忘的事情，或者因为自己的拖延症不做的事。\n\n\n
这么做相比写 todolist 有什么区别？\n
因为这里只记录你短期内要完成的事情，你能更专注的处理它们。\n
（空闲时间就回来扫视下待办列表，把没有完成的事情一并处理掉）\n\n\n`;
