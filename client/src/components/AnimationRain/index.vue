<template>
  <div v-if="!!show" class="animation-rain">
    <template v-for="(item, index) in animateList" :key="index">
      <AnimaItem :size="item.size || 64" :icon="icon" :animatParams="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import AnimaItem from './anima-item.vue';

interface Props {
  icon: string;
  show?: boolean;
  /** 动画结束触发 */
  end?: () => void;
}

const animateList = [
  { startOffsetRight: 160, time: 3.5, endOffsetRight: -320, },
  { startOffsetRight: 340, time: 3.5, endOffsetRight: 0, delay: .5, },
  { size: 72, startOffsetRight: 200, time: 3, endOffsetRight: 340, delay: .7, },
  { startOffsetRight: 508, time: 3.5, endOffsetRight: 340, delay: .9, },
  { startOffsetRight: 128, time: 3.5, endOffsetRight: 168, delay: 1, },
  { startOffsetRight: 32, time: 3, endOffsetRight: 96, delay: 1.1, },
  { size: 72, startOffsetRight: 388, time: 3.5, endOffsetRight: 340, delay: 1.5, },
  { startOffsetRight: 512, time: 3.5, endOffsetRight: 524, delay: 1.7, },
  { size: 72, startOffsetRight: 400, time: 3, endOffsetRight: 440, delay: 1.9, },
  { size: 72, startOffsetRight: 340, time: 2.9, endOffsetRight: 472, delay: 2, },
  { size: 72, startOffsetRight: 208, time: 2.9, endOffsetRight: -104, delay: 2.2, },
  { size: 72, startOffsetRight: 528, time: 3.5, endOffsetRight: 504, delay: 2.5, },
  { size: 72, startOffsetRight: 48, time: 3, endOffsetRight: -48, delay: 2.6, },
  { startOffsetRight: 404, time: 3, endOffsetRight: 276, delay: 2.8, },
  { size: 72, startOffsetRight: 600, time: 3.3, endOffsetRight: 534, delay: 3, },
  { size: 84, startOffsetRight: 666, time: 3, endOffsetRight: 676, delay: 3.1, },
  { size: 84, startOffsetRight: 436, time: 3, endOffsetRight: 904, delay: 3.25, },
  { size: 72, startOffsetRight: 612, time: 3, endOffsetRight: 544, delay: 3.3, },
  { startOffsetRight: 224, time: 3.5, endOffsetRight: 0, delay: 3.5, },
  { size: 84, startOffsetRight: 44, time: 3.45, endOffsetRight: 56, delay: 3.6, },
  { size: 84, startOffsetRight: 574, time: 3.45, endOffsetRight: 552, delay: 3.7, },
  { size: 84, startOffsetRight: 470, time: 3.45, endOffsetRight: 750, delay: 4, },
  { startOffsetRight: 360, time: 3, endOffsetRight: 268, delay: 4.05, },
  { size: 84, startOffsetRight: 128, time: 3.2, endOffsetRight: 16, delay: 4.2, },
]

// const getTimeConsuming = () => {
//   let timeConsuming = 0;
//   animateList.forEach(item => {
//     timeConsuming += item.delay;
//   })
// }

defineProps<Props>()

</script>

<style lang="scss">
.animation-rain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  pointer-events: none;
}
</style>
