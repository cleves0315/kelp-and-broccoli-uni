import { NodeEnvEnum } from './enum';

/**
 * 云开发环境ID
 * - development: 开发环境ID
 * - production: 生产环境ID
 */
export const cloudEnvMap = {
  [NodeEnvEnum.development]: 'broccoli-puuzo',
  // [NodeEnvEnum.production]: 'on-line-1gqban3ba49e3d35',
  [NodeEnvEnum.production]: 'broccoli-puuzo',
};
