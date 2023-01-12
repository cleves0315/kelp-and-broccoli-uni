<template>
  <div class="plan-detail-list">
    <template v-for="item in TypeMapList" :key="item.type">
      <ListItem
        :styles="itemStyle(item.type)"
        :icon="itemIcon(item.type)"
        :content="itemContent(item.type)"
        :subtitle="itemSubtitle(item.type)"
        :showClose="isShowClose(item.type)"
        :hasLine="item.type === PlanIconTypeEnum.life || item.type === PlanIconTypeEnum.end"
        :onClick="() => handleClick(item.type)"
        :onClose="() => handleClose(item.type)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PlanIconContMap, PlanIconMap, PlanLiveIconMap } from '@/constants/enum-map';
import { PlanTypeEnum, PlanIconTypeEnum } from '@/constants/enum';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { showHourseAndMinute } from '@/utils/common';
import ListItem from '../ListItem/index.vue';

import DateOver from '@/assets/plan/date_over.svg';

export interface Props {
  onClick?: (type: PlanIconTypeEnum) => void;
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const { onClick } = defineProps<Props>();

const TypeMapList = [
  {
    type: PlanIconTypeEnum.life,
    content: PlanIconContMap[PlanIconTypeEnum.life],
    icon: PlanIconMap[PlanIconTypeEnum.life],
    liveIcon: PlanLiveIconMap[PlanIconTypeEnum.life],
  },
  // {
  //   type: PlanIconTypeEnum.remind,
  //   content: PlanIconContMap[PlanIconTypeEnum.remind],
  //   icon: PlanIconMap[PlanIconTypeEnum.remind],
  //   liveIcon: PlanLiveIconMap[PlanIconTypeEnum.remind],
  // },
  {
    type: PlanIconTypeEnum.end,
    content: PlanIconContMap[PlanIconTypeEnum.end],
    icon: PlanIconMap[PlanIconTypeEnum.end],
    liveIcon: PlanLiveIconMap[PlanIconTypeEnum.end],
  },
  // {
  //   type: PlanIconTypeEnum.repeat,
  //   content: PlanIconContMap[PlanIconTypeEnum.repeat],
  //   icon: PlanIconMap[PlanIconTypeEnum.repeat],
  //   liveIcon: PlanLiveIconMap[PlanIconTypeEnum.repeat],
  // },
];

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

const itemContent = (type: PlanIconTypeEnum) => {
  const { plan } = detailStore;
  switch (type) {
    case PlanIconTypeEnum.remind:
      const { remind_time } = plan;
      if (remind_time) {
        return `在 ${showHourseAndMinute(remind_time)} 时提醒我`;
      }
      return PlanIconContMap[PlanIconTypeEnum.remind];
    case PlanIconTypeEnum.end:
      const { closing_date } = plan;
      if (closing_date) {
        return `${formatDate(closing_date)} 到期`;
      }
      return PlanIconContMap[PlanIconTypeEnum.end];

    default:
      return PlanIconContMap[type] || '';
  }
};

const itemSubtitle = (type: PlanIconTypeEnum) => {
  switch (type) {
    case PlanIconTypeEnum.remind:
      return formatDate(detailStore.plan.remind_time);

    default:
      return '';
  }
};

const isItemActive = (type: PlanIconTypeEnum) => {
  switch (type) {
    case PlanIconTypeEnum.life:
      return detailStore.plan.type === PlanTypeEnum.today;
    case PlanIconTypeEnum.remind:
      return !!detailStore.plan.remind_time;
    case PlanIconTypeEnum.end:
      return !!detailStore.plan.closing_date;

    default:
      return false;
  }
};

const itemStyle = (type: PlanIconTypeEnum) => {
  if (isItemActive(type)) {
    // 超过截止时间 - 展示红色字体
    if (type === PlanIconTypeEnum.end && Date.now() > detailStore.plan.closing_date) {
      return { color: '#d03c35' };
    }
    return { color: '#07b45b' };
  }
  return undefined;
};

const itemIcon = (type: PlanIconTypeEnum) => {
  if (isItemActive(type)) {
    // 超过截止时间
    if (type === PlanIconTypeEnum.end && Date.now() > detailStore.plan.closing_date) {
      return DateOver;
    }
    return PlanLiveIconMap[type];
  }
  return PlanIconMap[type];
};

const isShowClose = (type: PlanIconTypeEnum) => {
  switch (type) {
    case PlanIconTypeEnum.life:
      return detailStore.plan.type === PlanTypeEnum.today;
    case PlanIconTypeEnum.remind:
      return !!detailStore.plan.remind_time;
    case PlanIconTypeEnum.end:
      return !!detailStore.plan.closing_date;
    default:
      return false;
  }
};

const handleClick = (type: PlanIconTypeEnum) => {
  onClick?.(type);
};

const handleClose = (type: PlanIconTypeEnum) => {
  switch (type) {
    case PlanIconTypeEnum.life:
      store.updatePlan(detailStore.plan.plan_no, { type: 'all' });
      break;
    case PlanIconTypeEnum.remind:
      store.updatePlan(detailStore.plan.plan_no, { remind_time: 0 });
      break;
    case PlanIconTypeEnum.end:
      store.updatePlan(detailStore.plan.plan_no, { closing_date: 0 });
      break;

    default:
      break;
  }
};
</script>

<style lang="scss">
.plan-detail-list {
  .active {
    color: $themeGreen;
  }
  .overdue {
    color: $overdueRed;
  }
}
</style>
