import { initPlan, initStep } from '@/constants';
import { PlanTypeEnum } from '@/constants/enum';
import { planService } from '@/services';
import { IPlan, IRepeat, IStep } from '@/types/plan';
import { getGlobalData } from '@/utils/common';
import { log } from '@/utils/log';
import { uuid } from '@/utils/uuid';
import { defineStore } from 'pinia';

export interface State {
  planList: IPlan[];
  /** 重置滑动的计划（点击计划的 plan_no） */
  reTouch: string;
  touching: 'horizontal' | 'vertical' | '';
}

export interface SetPlan {
  /** 计划名称 */
  title?: string;
  /** 计划类型 */
  type?: 'all' | 'today';
  /** 详情描述 */
  detail?: string;
  /** 是否完成 */
  is_finish?: boolean;
  /** 截止时间 */
  closing_date?: number;
  /** 子计划列表 */
  stepList?: IStep[];
  /** 重复信息 */
  repeat?: IRepeat | {};
  /** 完成时间 */
  finish_date?: number;
  /** 提醒时间 */
  remind_time?: number;
}

export const usePlanStore = defineStore('planList', {
  state: (): State => ({
    planList: [],
    reTouch: '',
    touching: '',
  }),
  actions: {
    setPlanList(list: IPlan[]) {
      this.planList = list;
    },

    addPlan(title: string, type: PlanTypeEnum) {
      const data: IPlan = {
        ...initPlan,
        title,
        type,
        user_id: getGlobalData('user_id'),
        plan_no: uuid(),
        create_time: Date.now(),
        update_time: Date.now(),
      };

      this.planList.push(data);
      planService.addPlan(data);
    },

    delPlan(planNo: string) {
      const index = this.planList.findIndex((m) => m.plan_no === planNo);
      planService.delPlan(this.planList[index].plan_no);
      this.planList.splice(index, 1);
    },

    updatePlan(planNo: string, data: SetPlan, sync: boolean = false) {
      const index = this.planList.findIndex((m) => m.plan_no === planNo);
      if (index > -1) {
        Object.assign(this.planList[index], data);
        sync && planService.updatePlan(this.planList[index]);
      }
    },

    addStep(planNo: string, title: string) {
      const step = { ...initStep, id: uuid(), title };
      const index = this.planList.findIndex((m) => m.plan_no === planNo);

      if (index !== -1) {
        this.planList[index].step_list.push(step);
      }
    },

    delStep(planNo: string, stepId: string) {
      const index = this.planList.findIndex((m) => m.plan_no === planNo);
      const idx = this.planList[index].step_list.findIndex((m) => m.id === stepId);

      this.planList[index].step_list.splice(idx, 1);
    },

    editStep(planNo: string, stepId: string, data: { title?: string; is_finish?: boolean }) {
      const index = this.planList.findIndex((m) => m.plan_no === planNo);
      const idx = this.planList[index].step_list.findIndex((m) => m.id === stepId);

      Object.assign(this.planList[index].step_list[idx], data);
    },

    setTouching(val: 'horizontal' | 'vertical' | '') {
      this.touching = val;
    },

    setReTouch(planNo: string) {
      this.reTouch = planNo;
    },
  },
});
