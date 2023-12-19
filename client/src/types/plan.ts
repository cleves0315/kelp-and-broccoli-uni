export type IPlan = {
  _id?: string;
  /** 计划编号 */
  plan_no: string;
  /** 计划名称 */
  title: string;
  /** 用户id */
  user_id: string;
  open_id: string;
  /** 详情描述 */
  detail: string;
  /** 是否完成 */
  is_finish: boolean;
  /** 创建时间 */
  create_time: number;
  /** 更新时间 */
  update_time: number;
  /** 计划类型 all - 全局; today - 我的一天 */
  type: 'all' | 'today';
  /** 截止时间 */
  closing_date: number;
  /** 子计划列表 */
  step_list: IStep[];
  /** 重复信息 */
  repeat: IRepeat | {};
  /** 完成时间 */
  finish_date: number;
  /** 提醒时间 */
  remind_time?: number;
  /** 置顶时间 */
  top_time?: number;
};

export type IStep = {
  id: string;
  title: string;
  is_finish: boolean;
};

export type IRepeat = {
  base: number; // 1
  /** 是否完成 */
  finished: 0 | 1;
  /** 重复类型 */
  type: 'day' | 'week' | 'month' | 'year';
  /** 一周内某几天执行 */
  week_value: string[];
};

export type IWeekValue = '0' | '1' | '2' | '3' | '4' | '5' | '6'; // 周一 到 周日 的天数（0代表周日）
