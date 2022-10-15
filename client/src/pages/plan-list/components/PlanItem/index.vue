<template>
  <div
    class="plan-item"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <view
      ref="planRef"
      class="plan-item-wrap"
      :class="{ moving: moving }"
      :style="distance !== 0 ? `transform: translateX(${distance}px)` : ''"
    >
      <div class="operation"><Ident :checked="plan.is_finish" :onClick="onChangeFinish" /></div>
      <div class="plan-item-content" @click="intoDetail">
        <div class="head">{{ plan.title }}</div>
        <div class="detail-content">
          <!-- 我的一天 -->
          <view class="tips-block" v-if="plan.type === PlanTypeEnum.today">
            <image class="icon" :src="liveToday"></image>
            <text class="txt">我的一天</text>
          </view>
          <!-- 截止日期 -->
          <div
            class="tips-block end-date"
            :class="{ overdue: !isAfterToday(plan.closing_date) }"
            v-if="!!plan.closing_date"
          >
            <div class="split"></div>
            <image class="icon" :src="isAfterToday(plan.closing_date) ? overIcon : overIconExpired"></image>
            <text class="txt">{{ formatDate(plan.closing_date) }}</text>
          </div>
          <!-- 提醒 -->
          <div class="tips-block" v-if="plan.remind_time && isAfterToday(plan.remind_time)">
            <div class="split"></div>
            <image class="icon" :src="remindIcon"></image>
          </div>
          <!-- 编辑了详情 -->
          <div class="tips-block" v-if="plan.detail">
            <div class="split"></div>
            <image class="icon" :src="bookIcon"></image>
          </div>
        </div>
      </div>
    </view>
    <div
      class="delete-wrap"
      :class="{ moving: moving }"
      @click="onDelete"
      :style="{ width: `${-distance}px` }"
    >
      <image class="delete-icon" :src="delIcon"></image>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPlan } from '@/types/plan';
import Ident from '@/components/Ident/index.vue';
import { ref, reactive, toRefs, defineProps, watch, onBeforeMount } from 'vue';

import sunlight from '@/assets/plan/sunlight.svg';
// import repeatLive from '@/assets/plan/repeat_live.svg';
// import repeatExpired from '@/assets/plan/repeat_expired.svg';
import dateLive from '@/assets/plan/date_live.svg';
import dateOver from '@/assets/plan/date_over.svg';
import bookSvg from '@/assets/plan/book.svg';
import bell from '@/assets/plan/bell.svg';
import delSvg from '@/assets/del_white.svg';
import { usePlanStore } from '@/stores/plan';
import { PlanTypeEnum } from '@/constants/enum';

export type PlantItemProps = {
  plan: IPlan;
  touch?: string;
};

const props = defineProps<PlantItemProps>();
const { plan } = props;

const planRef = ref(null) as any;
const store = usePlanStore();

const data = reactive({
  liveToday: sunlight, // 我的一天
  // repeatIcon: repeatLive, // 重复
  // repeatIconExpired: repeatExpired,
  overIcon: dateLive, // 截止日期
  overIconExpired: dateOver,
  bookIcon: bookSvg, // 详情
  remindIcon: bell, // 提醒
  delIcon: delSvg, // 提醒

  distance: 0, // 手指滑动距离px（左边<0, 右边>0）
  moving: false, // 当前是否正在手势操作
});

// 手指移动临时状态
let touchX = 0,
  touchY = 0,
  startX = 0,
  domHeight = 0; // 单个元素节点高度px

onBeforeMount(() => {
  // 获取 DomRect
  // Taro小程序环境下这里必须延迟才能获取到
  setTimeout(async () => {
    const { height } = await planRef?.value?.getBoundingClientRect();
    domHeight = height;
  }, 500);
});

watch(
  () => store.reTouch,
  (newTouch) => {
    if (newTouch !== plan.plan_no) {
      data.distance = 0;
    }
  },
);

/**
 * 判断传入的时间是否大于当前时间
 */
const isAfterToday = (time: string | number) => {
  return new Date(time).getTime() > Date.now();
};

/**
 *  根据传入的时间戳返回一定格式的日期文字
 * @return 返回格式 xx年xx月xx日 周x
 */
const formatDate = (time: number | string) => {
  const date = new Date(time);
  const today = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = date.getDay();
  let wee = '';
  let dateString = '';

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

  // 判断是否'今天' | '明天'
  if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
    if (date.getDate() === today.getDate()) {
      return '今天';
    } else if (date.getDate() === new Date(today.getTime() + 86400000).getDate()) {
      return '明天';
    }
  }

  if (y !== new Date().getFullYear()) {
    dateString = y + '年' + m + '月' + d + '日 ' + wee;
  } else {
    dateString = m + '月' + d + '日 ' + wee;
  }

  return dateString;
};

const handleTouchStart = (e) => {
  const { clientX, clientY } = e.changedTouches[0];

  touchX = clientX;
  touchY = clientY;
  startX = data.distance;
  store.setReTouch(plan.plan_no);
};

const handleTouchMove = (e) => {
  const { clientX, clientY } = e.changedTouches[0];
  let diff = clientX - touchX + startX;

  if (store.touching === 'vertical') {
    return;
  }
  data.moving = true;

  if (!store.touching && Math.abs(clientX - touchX) > 15) {
    store.setTouching('horizontal');
  }
  if (Math.abs(clientY - touchY) > 15) {
    store.setTouching('vertical');
  }

  // 手势往右划 让他很难滑动
  if (diff > 0) {
    diff *= 0.1;
  }
  // 移动超过删除按钮的高度 让他很难滑动
  if (-diff > domHeight) {
    diff = -(domHeight - diff * 0.1);
  }

  data.distance = diff;
};

const handleTouchEnd = (e) => {
  const { clientX } = e.changedTouches[0];
  const diff = clientX - touchX;

  // 手指往左滑动超过了元素高度，展示删除按钮
  if (-diff > domHeight) {
    data.distance = -domHeight - 15;
  } else {
    data.distance = 0;
  }

  data.moving = false;
  store.setTouching('');
};

/** 设置元素节点横向偏移值 */
const setDistance = (num: number) => {
  data.distance = num;
};

const onChangeFinish = () => {
  store.editPlan(
    plan.plan_no,
    {
      finish_date: Date.now(),
      is_finish: !plan.is_finish,
    },
    true,
  );
};

const intoDetail = () => {
  uni.navigateTo({
    url: `/pages/plan-detail/index?plan_no=${plan.plan_no}`,
  });
};

const onDelete = async () => {
  // 两下震动
  uni.vibrateShort({});
  setTimeout(() => uni.vibrateShort({}), 200);

  try {
    await uni.showActionSheet({
      itemList: ['删除计划'],
      itemColor: '#EA3927',
    });

    store.delPlan(plan.plan_no);
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  setDistance,
});

const { liveToday, overIcon, overIconExpired, bookIcon, remindIcon, delIcon, distance, moving } =
  toRefs(data);
</script>

<style lang="scss">
.plan-item {
  position: relative;
  height: 110rpx;
  overflow: hidden;
  border-radius: 20rpx;
  margin-bottom: 5rpx;
  background-color: #fefefe;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.05);

  .plan-item-wrap {
    display: flex;
    height: inherit;
    padding: 0 30rpx;
    box-sizing: border-box;
    transition: transform 0.4s;

    &.moving {
      transition: unset;
    }
  }

  .operation {
    display: flex;
    align-items: center;
    margin-right: 30rpx;
  }

  .plan-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .head {
    font-size: 32rpx;
    white-space: nowrap;
  }

  .detail-content {
    display: flex;
    align-items: center;
    margin-top: 2rpx;

    .tips-block {
      display: flex;
      align-items: center;
      color: $themeGreen;
      font-size: 28rpx;
      overflow: hidden;

      &.overdue {
        .txt {
          color: $overdueRed;
        }
      }
      &:nth-last-of-type(1),
      &:nth-last-of-type(2) {
        flex-shrink: 0;
      }
    }

    .icon {
      width: 20rpx;
      height: 20rpx;
      margin-right: 16rpx;
    }
    .txt {
      font-size: 28rpx;
      color: #757575;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .end-date {
      .txt {
        color: $themeGreen;
      }
    }

    .tips-block:first-child {
      .split {
        display: none;
      }
    }
    .split {
      width: 4rpx;
      height: 4rpx;
      margin-left: 16rpx;
      margin-right: 16rpx;
      background: #757575;
      border-radius: 50%;
    }
  }

  .delete-wrap {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    display: flex;
    height: inherit;
    align-items: center;
    justify-content: center;
    transition: width 0.4s ease;
    // transition: width .3 ease;
    background-color: $overdueRed;
    border-radius: 0 20rpx 20rpx 0;

    &.moving {
      transition: unset;
    }

    .delete-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

// 关闭滚动条样式
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
