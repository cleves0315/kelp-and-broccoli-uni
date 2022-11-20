import { IPlan } from '@/types/plan';
import { defineStore } from 'pinia';

export interface CalendarModalConfig {
  /** 显示日历弹窗 */
  show?: boolean;
  /** 标记：点击返回按钮时，展示对应标记的 actionSheet 选项 */
  mark?: 'remind' | 'end';
  /** 显示时间栏 */
  showTimeColumn?: boolean;
  /** 时间栏文本 */
  timeCloumnText?: string;
  /** 选中的日历日期对象 */
  choiceDate?: any;
}
export interface PickerTimeConfig {
  /** 显示时间选择器 */
  show?: boolean;
}
export interface State {
  plan: IPlan;
  calendarModalConfig: CalendarModalConfig;
  pickerTimeConfig: PickerTimeConfig;
}

export const usePlanDetailStore = defineStore('planDetail', {
  state: (): State => ({
    // @ts-ignore
    plan: undefined,
    calendarModalConfig: {},
    pickerTimeConfig: {},
  }),
  actions: {
    setPlan(data?: IPlan) {
      this.plan = data;
    },
    showCalendarModal(val: boolean) {
      this.calendarModalConfig.show = val;
    },
    setCalendarModalConfig(data: CalendarModalConfig) {
      Object.assign(this.calendarModalConfig, data);
    },
    setPickerTimeConfig(data: PickerTimeConfig) {
      if (data.show) {
        Object.assign(this.pickerTimeConfig, data);
      } else {
        this.pickerTimeConfig = {};
      }
    },
  },
});
