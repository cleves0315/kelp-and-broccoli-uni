<template>
  <div
    class="calendar-box"
    :class="{ hide: !show }"
    @click.self="handleClose"
  >
    <div
      class="container"
      :class="{ hidebox: !show }"
      :style="{ bottom: `-${bottom}px` }"
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
        class="choice-date-line"
        :class="{ 'choice-date-line-touch': isChoiceLineTouch }"
        @click.stop="handleOnChoiceTime"
        @touchstart="choiceLineTouchStart"
        @touchend.stop="choiceLineTouchEnd"
      >
        <div class="left">选择时间</div>
        <div class="right">
          <div class="right-txt">明天</div>
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
import { log } from '@/utils/log';
import { reactive, toRefs, watch } from 'vue';

export interface Props {
  show: boolean;
  chioceTime?: (selectDate: SelectDay) => void;
  onClose?: () => void;
  onBack?: () => void;
}

const { show, onClose, onBack, chioceTime } = defineProps<Props>();

const data = reactive({
  startY: 0,
  bottom: 0, // 绝对定位bottom值 px
  isChoiceLineTouch: 0,
});

let choiceDate: SelectDay;

const handelTouchStart = (e: any) => {
  const pageY = e.changedTouches[0].pageY;
  data.startY = pageY;
};

const handelTouchMove = (e: any) => {
  const moveY = e.changedTouches[0].pageY;
  let difY = moveY - data.startY;
  if (difY <= 0) difY = 0;
  data.bottom = difY;
};

const handelTouchEnd = (e: any) => {
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
  onClose?.();
};

/**点击返回按钮 */
const handleOnBack = () => {
  onBack?.();
};

/** 点击设置按钮 */
const handleTapSetup = () => {
};

const handleOnChoiceDate = (value: SelectDay) => {
  choiceDate = value;
  log('handleOnChoiceDate: ', value)
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
