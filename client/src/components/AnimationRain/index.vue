<template>
  <div v-if="!!show" class="animation-rain">
    <template v-for="(item, index) in animateList" :key="index">
      <AnimaItem :size="item.size || 64" :icon="LOGO_TRANSP_BASE64" :animatParams="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import AnimaItem from './anima-item.vue';

interface Props {
  show?: boolean;
  /** 动画结束触发 */
  end?: () => void;
}

const LOGO_TRANSP_BASE64 = `data:image/png;base64,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
`;

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
