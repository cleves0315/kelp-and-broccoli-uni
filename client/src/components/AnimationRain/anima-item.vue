<template>
  <div class="animation-rain-icon animi-icon1" :style="{
    backgroundImage: `url(${icon})`,
    '--icon-size': `${size}rpx`,
    '--icon-start-offset-right': `${animatParams.startOffsetRight}rpx`,
    '--icon-anima-time': `${animatParams.time}s`,
    '--icon-end-offset-right': `${animatParams.endOffsetRight}rpx`,
    '--icon-delay': `${animatParams.delay || 0}s`,
  }"></div>
</template>

<script lang="ts" setup>

interface AnimatParams {
  startOffsetRight: number;
  endOffsetRight: number;
  /** 动画时间（s） */
  time: number;
  /** 延迟时间（s） */
  delay?: number;
}

interface Props {
  icon?: string;
  size: number;
  animatParams: AnimatParams;
}

defineProps<Props>()

</script>

<style lang="scss">
.animation-rain-icon {
  position: absolute;
  top: calc(var(--icon-size) * -1);
  width: var(--icon-size);
  height: var(--icon-size);
  z-index: 4;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

@keyframes animiRain1 {
  100% {
    top: 100vh;
    right: var(--icon-end-offset-right);
  }
}

.animi-icon1 {
  right: var(--icon-start-offset-right);
  animation: animiRain1 var(--icon-anima-time) linear var(--icon-delay);
}
</style>
