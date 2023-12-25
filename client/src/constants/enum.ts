/**
 * node运行环境
 * - development: 开发环境
 * - production: 生产环境
 */
export enum NodeEnvEnum {
  development = 'development',
  production = 'production',
}

/**
 * 全局变量 key
 */
export enum GlobalKeys {}
// useServe = 'useServe',

/**
 * plan 计划类型
 * ```
 * all - 所有
 * today - 我的一天
 * ```
 */
export enum PlanTypeEnum {
  all = 'all',
  today = 'today',
}

/**
 * 左侧icon图标
 *  life 我的一天
 *  remind 提醒我
 *  end 截止日期
 *  repeat 重复
 */
export enum PlanIconTypeEnum {
  /** 我的一天 */
  life = 'life',
  /** 提醒我 */
  remind = 'remind',
  /** 截止日期 */
  end = 'end',
  /** 重复 */
  // repeat = 'repeat',
}

export enum PlanNoEnum {
  'wiki' = '001',
}
