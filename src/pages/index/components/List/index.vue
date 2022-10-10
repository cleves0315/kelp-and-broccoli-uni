<template>
  <div class="list">
    <template v-for="item in TypeMapList" :key="item.type">
      <ListItem
        :class="itemClass(item.type)"
        :icon="itemIcon(item.type)"
        :content="itemContent(item.type)"
        :subtitle="itemSubtitle(item.type)"
        :showClose="isShowClose(item.type)"
        :hasLine="item.type === TypeEnum.life || item.type === TypeEnum.end"
        :onClick="() => handleClick(item.type)"
        :onClose="() => handleClose(item.type)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import SunlightIcon from '@/assets/plan/sunlight.svg';
import SunlightLiveIcon from '@/assets/plan/sunlight_live.svg';
import BellIcon from '@/assets/plan/bell.svg';
import BellLiveIcon from '@/assets/plan/bell_live.svg';
import DateIcon from '@/assets/plan/date.svg';
import DateLiveIcon from '@/assets/plan/date_live.svg';
import DateOver from '@/assets/plan/date_over.svg';
// import RepeatIcon from '@/assets/plan/repeat.svg';
// import RepeatLiveIcon from '@/assets/plan/repeat_live.svg';

import { usePlanDetailStore } from '@/stores/planDetail';
import { showHourseAndMinute } from '@/utils/common';

/**
 * 左侧icon图标
 *  life 我的一天
 *  remind 提醒我
 *  end 截止日期
 *  repeat 重复
 */
export enum TypeEnum {
  /** 我的一天 */
  life = 'life',
  /** 提醒我 */
  remind = 'remind',
  /** 截止日期 */
  end = 'end',
  /** 重复 */
  // repeat = 'repeat',
}

export const contentMap = {
  [TypeEnum.life]: '我的一天',
  [TypeEnum.remind]: '提醒我',
  [TypeEnum.end]: '添加截止日期',
  // [TypeEnum.repeat]: '重复',
};

export const iconMap = {
  [TypeEnum.life]: SunlightIcon,
  [TypeEnum.remind]: BellIcon,
  [TypeEnum.end]: DateIcon,
  // [TypeEnum.repeat]: RepeatIcon,
};

export const liveIconMap = {
  [TypeEnum.life]: SunlightLiveIcon,
  [TypeEnum.remind]: BellLiveIcon,
  [TypeEnum.end]: DateLiveIcon,
  // [TypeEnum.repeat]: RepeatLiveIcon,
};

export const TypeMapList = [
  {
    type: TypeEnum.life,
    content: contentMap[TypeEnum.life],
    icon: iconMap[TypeEnum.life],
    liveIcon: liveIconMap[TypeEnum.life],
  },
  {
    type: TypeEnum.remind,
    content: contentMap[TypeEnum.remind],
    icon: iconMap[TypeEnum.remind],
    liveIcon: liveIconMap[TypeEnum.remind],
  },
  {
    type: TypeEnum.end,
    content: contentMap[TypeEnum.end],
    icon: iconMap[TypeEnum.end],
    liveIcon: liveIconMap[TypeEnum.end],
  },
  // {
  //   type: TypeEnum.repeat,
  //   content: contentMap[TypeEnum.repeat],
  //   icon: iconMap[TypeEnum.repeat],
  //   liveIcon: liveIconMap[TypeEnum.repeat],
  // },
];
</script>

<script lang="ts" setup>
import { PlanTypeEnum } from '@/constants/enum';
import { usePlanStore } from '@/stores/plan';
import ListItem from '../ListItem/index.vue';

export interface Props {
  onClick?: (type: TypeEnum) => void;
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const { onClick } = defineProps<Props>();

/**
 *  根据传入的时间戳返回一定格式的日期文字
 * @param { Number } d
 * @return 返回格式 xx年xx月xx日 周x
 */
const formatDate = (times) => {
  const today = new Date();
  let date = new Date(times);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let w = date.getDay();
  let wee = '';
  let dateString = '';

  if (!times) {
    return '';
  }

  if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
    if (date.getDate() === today.getDate()) {
      return '今天';
    } else if (date.getDate() === new Date(today.getTime() + 86400000).getDate()) {
      return '明天';
    }
  }

  switch (w) {
    case 0:
      wee = '周日';
      break;
    case 1:
      wee = '周一';
      break;
    case 2:
      wee = '周二';
      break;
    case 3:
      wee = '周三';
      break;
    case 4:
      wee = '周四';
      break;
    case 5:
      wee = '周五';
      break;
    case 6:
      wee = '周六';
      break;
  }

  if (y !== new Date().getFullYear()) {
    dateString = y + '年' + m + '月' + d + '日 ' + wee;
  } else {
    dateString = m + '月' + d + '日 ' + wee;
  }

  return dateString;
};

const itemContent = (type: TypeEnum) => {
  const { plan } = detailStore;
  switch (type) {
    case TypeEnum.remind:
      const { remind_time } = plan;
      if (remind_time) {
        return `在 ${showHourseAndMinute(remind_time)} 时提醒我`;
      }
      return contentMap[TypeEnum.remind];
    case TypeEnum.end:
      const { closing_date } = plan;
      if (closing_date) {
        return `${formatDate(closing_date)} 到期`;
      }
      return contentMap[TypeEnum.end];

    default:
      return contentMap[type] || '';
  }
};

const itemSubtitle = (type: TypeEnum) => {
  switch (type) {
    case TypeEnum.remind:
      return formatDate(detailStore.plan.remind_time);

    default:
      return '';
  }
};

const isItemActive = (type: TypeEnum) => {
  switch (type) {
    case TypeEnum.life:
      return detailStore.plan.type === PlanTypeEnum.today;
    case TypeEnum.remind:
      return !!detailStore.plan.remind_time;
    case TypeEnum.end:
      return !!detailStore.plan.closing_date;

    default:
      return false;
  }
};

const itemClass = (type: TypeEnum) => {
  if (isItemActive(type)) {
    // 超过截止时间 - 展示红色字体
    if (type === TypeEnum.end && Date.now() > detailStore.plan.closing_date) {
      return 'overdue';
    }
    return 'active';
  }
  return '';
};

const itemIcon = (type: TypeEnum) => {
  if (isItemActive(type)) {
    // 超过截止时间
    if (type === TypeEnum.end && Date.now() > detailStore.plan.closing_date) {
      return DateOver;
    }
    return liveIconMap[type];
  }
  return iconMap[type];
};

const isShowClose = (type: TypeEnum) => {
  switch (type) {
    case TypeEnum.life:
      return detailStore.plan.type === PlanTypeEnum.today;
    case TypeEnum.remind:
      return !!detailStore.plan.remind_time;
    case TypeEnum.end:
      return !!detailStore.plan.closing_date;
    default:
      return false;
  }
};

const handleClick = (type: TypeEnum) => {
  onClick?.(type);
};

const handleClose = (type: TypeEnum) => {
  switch (type) {
    case TypeEnum.life:
      store.editPlan(detailStore.plan.plan_no, { type: 'all' });
      break;
    case TypeEnum.remind:
      store.editPlan(detailStore.plan.plan_no, { remind_time: 0 });
      break;
    case TypeEnum.end:
      store.editPlan(detailStore.plan.plan_no, { closing_date: 0 });
      break;

    default:
      break;
  }
};
</script>

<style lang="scss">
@import '@/styles/global.scss';

.active {
  color: $themeGreen;
}
.overdue {
  color: $overdueRed;
}
</style>
