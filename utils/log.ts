// 一个漂亮的打印方案
import { LOGO_TRANSP_BASE64 } from '@/constants/global';
import { useLog, useGroup, useGroupCollapsed } from './useLog';

/**
 * 自定义彩色打印
 */
export const log = (message?: any, ...optionalParams: any[]) => {
  const [logs] = useLog({ icon: LOGO_TRANSP_BASE64 });
  logs(message, ...optionalParams);
};

/**
 * 自定义err打印
 */
export const logErr = (message?: any, ...optionalParams: any[]) => {
  const [logs] = useLog({
    color: '#fff',
    bkColor: '#e74c3c',
    icon: LOGO_TRANSP_BASE64,
  });
  logs(message, ...optionalParams);
};

/**
 * 默认全局彩色打印
 */
export const group = (...label: any[]) => {
  const [groups] = useGroup({ icon: LOGO_TRANSP_BASE64 });
  groups(...label);
};

/**
 * 默认全局彩色打印
 */
export const groupCollapsed = (...label: any[]) => {
  const [groupCollapseds] = useGroupCollapsed({ icon: LOGO_TRANSP_BASE64 });
  groupCollapseds(...label);
};

export const groupEnd = () => {
  const [, groupEnd] = useGroup({ icon: LOGO_TRANSP_BASE64 });
  groupEnd();
};
