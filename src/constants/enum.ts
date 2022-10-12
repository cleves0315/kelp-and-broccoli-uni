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

/** 点击 logo 状态枚举 */
export enum TouchLogo {
  normal = 0, // 正常
  down = 1, // 点击
  up = 2, // 放开
}

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
