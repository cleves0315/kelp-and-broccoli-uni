import SunlightIcon from '@/assets/plan/sunlight.svg';
import SunlightLiveIcon from '@/assets/plan/sunlight_live.svg';
import BellIcon from '@/assets/plan/bell.svg';
import BellLiveIcon from '@/assets/plan/bell_live.svg';
import DateIcon from '@/assets/plan/date.svg';
import DateLiveIcon from '@/assets/plan/date_live.svg';
import { NodeEnvEnum, PlanIconTypeEnum } from './enum';

export const PlanIconContMap = {
  [PlanIconTypeEnum.life]: '我的一天',
  [PlanIconTypeEnum.remind]: '提醒我',
  [PlanIconTypeEnum.end]: '添加截止日期',
  // [PlanIconTypeEnum.repeat]: '重复',
};

export const PlanIconMap = {
  [PlanIconTypeEnum.life]: SunlightIcon,
  [PlanIconTypeEnum.remind]: BellIcon,
  [PlanIconTypeEnum.end]: DateIcon,
  // [PlanIconTypeEnum.repeat]: RepeatIcon,
};

export const PlanLiveIconMap = {
  [PlanIconTypeEnum.life]: SunlightLiveIcon,
  [PlanIconTypeEnum.remind]: BellLiveIcon,
  [PlanIconTypeEnum.end]: DateLiveIcon,
  // [PlanIconTypeEnum.repeat]: RepeatLiveIcon,
};
