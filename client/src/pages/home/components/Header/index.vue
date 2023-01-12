<template>
  <div class="header">
    <div class="head">
      <div class="title">我在海带与西兰花</div>
      <image
        class="logos"
        :class="{ 'touch-logo': touchLogo == 1, 'touch-end-logo': touchLogo == 2 }"
        mode="widthFix"
        @touchstart="logoTouchStart"
        @touchend="logoTouchEnd"
        @click="onPlay"
        :src="LOGO_TRANSP_BASE64"
      >
      </image>
    </div>
    <div class="content">
      <div class="date">
        <div class="num">{{ day || '1' }}</div>
        <div class="day">天</div>
      </div>
      <!-- 进入日历 -->
      <!-- <div class="btn" >{{btnTxt}}<div class="arrow-right"></div></div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LOGO_TRANSP_BASE64, BO } from '@/constants';
import { ref, reactive, toRefs } from 'vue';
import { TouchLogo } from '@/constants/enum';

export interface Props {
  day?: number;
}

const timer = ref<NodeJS.Timeout>(null);
const { day = 0 } = defineProps<Props>();
const data = reactive({
  touchLogo: TouchLogo.normal,
});

const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.src = BO;

const onPlay = () => {
  innerAudioContext.play();
};

const logoTouchStart = () => {
  clearTimeout(timer.value);
  data.touchLogo = TouchLogo.down;
};

const logoTouchEnd = () => {
  data.touchLogo = TouchLogo.up;

  timer.value = setTimeout(() => {
    data.touchLogo = TouchLogo.normal;
  }, 180);

  if (innerAudioContext.paused) {
    innerAudioContext.play();
  }
};

const { touchLogo } = toRefs(data);
</script>

<style lang="scss">
.header {
  position: relative;
  background: no-repeat 0 0/100%;
  padding-bottom: 56rpx;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    width: 60vw;
    z-index: -1;
    border-radius: 0 0 50%;
    background: #07b45b;
    filter: blur(75rpx);
  }

  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .title {
    font-size: 36rpx;
    font-weight: 600;
  }

  .logos {
    width: 68rpx;
    max-height: 68rpx;
    transition: transform 0.2s;
  }
  .touch-logo {
    transform: scale(0.7, 0.7);
  }
  .touch-end-logo {
    transform: scale(1.2, 1.2);
  }

  .content {
    display: flex;
    margin-top: 30rpx;
    justify-content: space-between;
    align-items: center;
  }

  .date {
    display: flex;
    align-items: center;
  }

  .date .num {
    font-size: 120rpx;
  }

  .date .day {
    font-size: 32rpx;
    margin-left: 10rpx;
    margin-top: 28rpx;
  }

  .content .btn {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    background: #f9de70;
    border-radius: 50rpx;
    padding: 8rpx 20rpx;
    box-sizing: content-box;
    margin-top: 20rpx;
    font-weight: 600;
  }

  .content .btn .arrow-right {
    width: 16rpx;
    height: 16rpx;
    transform: rotate(45deg);
    border-top: 2rpx solid #333;
    border-right: 2rpx solid #333;
    margin-left: 6rpx;
  }
}
</style>
