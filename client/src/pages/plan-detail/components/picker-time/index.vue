<template>
  <div class="picker-time" :class="{ hide: !detailStore.pickerTimeConfig.show }" @click="handleClose">
    <div
      class="container"
      :class="{ hidebox: !detailStore.pickerTimeConfig.show }"
      :style="{ bottom: `-${bottom}px` }"
    >
      <div @touchstart="handelTouchStart" @touchmove="handelTouchMove" @touchend="handelTouchEnd">
        <div class="marking-wrap">
          <div class="marking-line"></div>
        </div>
        <div class="header">
          <div class="left" @click.stop="handleOnBack">
            <image class="left-icon" mode="widthFix" src="@/assets/to_back_green.svg"></image>
            {{ currentDate.year }}年{{ currentDate.month }}月
          </div>
          <div class="title">选择时间</div>
          <div class="right" @click.stop="handleOnSetup">
            <div class="right-txt">设置</div>
          </div>
        </div>
      </div>
      <picker-view
        class="picker-view"
        indicator-style="height: 50px;"
        :value="value"
        @change="handleOnChange"
      >
        <picker-view-column>
          <div v-for="item in hourse" :key="item" class="picker-view-column-item">
            {{ item }}
          </div>
        </picker-view-column>
        <picker-view-column>
          <div v-for="item in minutes" :key="item" class="picker-view-column-item">
            {{ item }}
          </div>
        </picker-view-column>
      </picker-view>
      <IphoneBottomSideAdapter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IphoneBottomSideAdapter from '@/components/IphoneBottomSideAdapter/index.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { log } from '@/utils/log';
import { reactive, toRefs, watch } from 'vue';

export interface CurrentDate {
  year: number;
  month: number;
  day: number;
}

const hourList: string[] = [];
const minuteList: string[] = [];

for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    hourList.push('0' + i);
  } else {
    hourList.push('' + i);
  }
}

for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    minuteList.push('0' + i);
  } else {
    minuteList.push('' + i);
  }
}

interface Props {
  currentDate: CurrentDate;
  onClose?: () => void;
  onBack?: (time: string) => void;
  onSetup?: (time: string) => void;
}

let startY = 0;

const store = usePlanStore();
const detailStore = usePlanDetailStore();
const { currentDate, onClose, onBack, onSetup } = defineProps<Props>();

const data = reactive({
  hourse: hourList,
  minutes: minuteList,
  value: [0, 0],
  bottom: 0, // 绝对定位bottom值 px
});

watch(
  () => detailStore.calendarModalConfig.timeCloumnText,
  (newCurrentTime) => {
    if (newCurrentTime) {
      const value = data.value;
      const h = newCurrentTime.split(':')[0];
      const m = newCurrentTime.split(':')[1];

      for (let i = 0; i < data.hourse.length; i++) {
        const item = data.hourse[i];
        if (+item === +h) {
          value[0] = i;
          break;
        }
      }
      for (let i = 0; i < data.minutes.length; i++) {
        const item = data.minutes[i];
        if (+item === +m) {
          value[1] = i;
          break;
        }
      }

      // 根据当前传递的时间，默认选择列表项里
      data.value = value;
    }
  },
);

const handleClose = () => {
  detailStore.setPickerTimeConfig({ show: false });
  // detailStore.setCalendarModalConfig({ showTimeColumn: false, timeCloumnText: '' });
  onClose?.();
};
const handelTouchStart = (e) => {
  const pageY = e.changedTouches[0].pageY;
  startY = pageY;
};
const handelTouchMove = (e) => {
  const moveY = e.changedTouches[0].pageY;
  let difY = moveY - startY;

  if (difY <= 0) difY = 0;

  data.bottom = difY;
};
const handelTouchEnd = (e) => {
  const endY = e.changedTouches[0].pageY;
  if (endY - startY > 50) {
    onClose?.();
    setTimeout(() => {
      data.bottom = 0;
    }, 500);
  } else {
    data.bottom = 0;
  }
};

const handleOnBack = () => {
  const value = data.value;
  const pickResultH = data.hourse[value[0]];
  const pickResultM = data.minutes[value[1]];
  const pickTime = `${pickResultH}:${pickResultM}`;

  detailStore.setPickerTimeConfig({ show: false });
  detailStore.showCalendarModal(true);
  detailStore.setCalendarModalConfig({
    // mark: 'remind',
    showTimeColumn: true,
    timeCloumnText: pickTime,
  });
  onBack?.(pickTime);
};
const handleOnSetup = () => {
  const value = data.value;
  const hourse = data.hourse[value[0]];
  const minutes = data.minutes[value[1]];
  const time = `${hourse}:${minutes}`;
  const choiceDate = detailStore.calendarModalConfig.choiceDate;
  const mText = Math.floor(choiceDate.month) < 10 ? `0${choiceDate.month}` : choiceDate.month;
  const dText = Math.floor(choiceDate.day) < 10 ? `0${choiceDate.day}` : choiceDate.day;
  const date = `${choiceDate.year}-${mText}-${dText}`;
  const remindDate = `${date} ${time}`;

  log('设置提醒时间：', remindDate);
  store.updatePlan(detailStore.plan.plan_no, { remind_time: new Date(remindDate).getTime() });
  detailStore.setPickerTimeConfig({ show: false });
  onSetup?.(time);
};

const handleOnChange = (e) => {
  const { value } = e.detail;
  data.value = value;
};

const {
  hourse,
  minutes,
  value,
  bottom, // 绝对定位bottom值 px
} = toRefs(data);
</script>

<style lang="scss">
.picker-time {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  transition: visibility 0.2s ease;
  background: rgba(0, 0, 0, 0.4);

  &.hide {
    visibility: hidden;
  }

  .container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafafa;
    overflow: hidden;
    border-radius: 20rpx 20rpx 0 0;
    transition: transform 0.2s ease;

    &.hidebox {
      transform: translateY(100%);
    }
  }

  .marking-wrap {
    background: #fff;
    padding-top: 16rpx;
  }

  .marking-line {
    width: 66rpx;
    height: 8rpx;
    background: #8d8d8d;
    border-radius: 100rpx;
    margin: 0 auto;
  }

  .header {
    position: relative;
    padding: 20rpx 0;
    background: #fff;

    .left,
    .right {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
    }

    .left {
      left: 20rpx;
      font-size: 32rpx;
      color: #07b45b;
    }

    .right {
      right: 20rpx;
    }

    .left-icon {
      width: 40rpx;
      height: 40rpx;
    }

    .right-txt {
      font-size: 32rpx;
      font-weight: 500;
      color: #07b45b;
    }

    .title {
      text-align: center;
      font-weight: 500;
      font-size: 36rpx;
    }
  }

  .picker-view {
    width: 100%;
    height: 300px;
  }

  .picker-view-column-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
