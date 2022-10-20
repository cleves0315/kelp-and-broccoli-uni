<template>
  <div class="calendar-box" :class="{ hide: !detailStore.calendarModalConfig.show }" @click="handleClose">
    <div
      class="container"
      :class="{ hidebox: !detailStore.calendarModalConfig.show }"
      :style="{ bottom: `-${bottom}px` }"
      @click.stop
      @touchstart="handelTouchStart"
      @touchmove="handelTouchMove"
      @touchend.stop="handelTouchEnd"
    >
      <div class="marking-wrap">
        <div class="marking-line"></div>
      </div>
      <!-- 日历组件 -->
      <Calendar :onClick="handleOnChoiceDate" :onBack="handleOnBack" :onSetting="handleTapSetup" />
      <!-- 选择时间 -->
      <div
        v-if="detailStore.calendarModalConfig.showTimeColumn"
        class="choice-date-line"
        :class="{ 'choice-date-line-touch': isChoiceLineTouch }"
        @click.stop="handleOnChoiceTime"
        @touchstart="choiceLineTouchStart"
        @touchend.stop="choiceLineTouchEnd"
      >
        <div class="left">选择时间</div>
        <div class="right">
          <div class="right-txt">{{ detailStore.calendarModalConfig.timeCloumnText }}</div>
          <image class="icon" src="@/assets/to_back_green.svg"></image>
        </div>
      </div>
      <IphoneBottomSideAdapter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Calendar, { SelectDay } from '@/components/calendar/index.vue';
import IphoneBottomSideAdapter from '@/components/IphoneBottomSideAdapter/index.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { log } from '@/utils/log';
import { reactive, toRefs, watch } from 'vue';

export interface Props {
  chioceTime?: (selectDate: SelectDay) => void;
  onClose?: () => void;
  onBack?: () => void;
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();
const { onClose, onBack, chioceTime } = defineProps<Props>();

const data = reactive({
  startY: 0,
  bottom: 0, // 绝对定位bottom值 px
  isChoiceLineTouch: 0,
});

let choiceDate: SelectDay;

watch(
  () => detailStore.calendarModalConfig.show,
  (newValue) => {
    if (newValue && !detailStore.calendarModalConfig.choiceDate) {
      const today = new Date();

      detailStore.setCalendarModalConfig({
        choiceDate: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        },
      });
    }
  },
);

const handelTouchStart = (e) => {
  const pageY = e.changedTouches[0].pageY;
  data.startY = pageY;
};

const handelTouchMove = (e) => {
  const moveY = e.changedTouches[0].pageY;
  let difY = moveY - data.startY;
  if (difY <= 0) difY = 0;
  data.bottom = difY;
};

const handelTouchEnd = (e) => {
  const endY = e.changedTouches[0].pageY;
  if (endY - data.startY > 50) {
    handleClose();
    setTimeout(() => {
      data.bottom = 0;
    }, 500);
  } else {
    data.bottom = 0;
  }
};

const handleClose = () => {
  detailStore.showCalendarModal(false);
  onClose?.();
};

/**点击返回按钮 */
const handleOnBack = () => {
  onBack?.();
};

/** 点击设置按钮 */
const handleTapSetup = () => {
  // argument -> value
  // choiceDate === value 两者相同，这里直接用 sotre 数据
  const choiceDate = detailStore.calendarModalConfig.choiceDate;
  const mText = Math.floor(choiceDate.month) < 10 ? `0${choiceDate.month}` : choiceDate.month;
  const dText = Math.floor(choiceDate.day) < 10 ? `0${choiceDate.day}` : choiceDate.day;
  const date = `${choiceDate.year}/${mText}/${dText}`;
  const curntHour = new Date().getHours() + 4;
  const remindDate = `${date} ${curntHour}:00`;

  if (detailStore.calendarModalConfig.mark === 'remind') {
    log('设置提醒时间：', remindDate);
    store.updatePlan(detailStore.plan.plan_no, { remind_time: new Date(remindDate).getTime() });
  } else if (detailStore.calendarModalConfig.mark === 'end') {
    const lastTime = new Date(`${date} 23:59:59`).getTime();
    log('设置截止时间：', lastTime);
    store.updatePlan(detailStore.plan.plan_no, {
      closing_date: lastTime,
    });
  }
  detailStore.showCalendarModal(false);
};

const handleOnChoiceDate = (value: SelectDay) => {
  choiceDate = value;
  detailStore.setCalendarModalConfig({ choiceDate: value });
};

/** 底部选择时间栏touch手势 */
const choiceLineTouchStart = () => {
  data.isChoiceLineTouch = 1;
};
const choiceLineTouchEnd = () => {
  data.isChoiceLineTouch = 0;
};

/** 点击选择时间栏 */
const handleOnChoiceTime = () => {
  detailStore.showCalendarModal(false);
  detailStore.setPickerTimeConfig({ show: true });
  chioceTime?.(choiceDate);
};

const { bottom, isChoiceLineTouch } = toRefs(data);
</script>

<style lang="scss">
.calendar-box {
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
    transition: transform 0.2s ease;
    border-radius: 20rpx 20rpx 0 0;

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

  /* 底部选择时间 */
  .choice-date-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30rpx 0;
    padding: 20rpx 40rpx;
    background: #fff;
    border-top: 2rpx solid #efefef;
    border-bottom: 2rpx solid #efefef;
  }

  .choice-date-line-touch {
    background: #f3f3f3 !important;
  }

  .choice-date-line .right {
    display: flex;
    align-items: center;
  }

  .choice-date-line .right .right-txt {
    margin-right: 20rpx;
    color: #07b45b;
    font-weight: 500;
  }

  .choice-date-line .right .icon {
    width: 40rpx;
    height: 40rpx;
    transform: rotate(180deg);
  }
}
</style>
