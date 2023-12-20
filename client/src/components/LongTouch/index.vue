<template>
  <div @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  delay?: number;
}

const emit = defineEmits(['longTouch']);
const { delay = 400 } = defineProps<Props>();

const timer = ref();
const start = ref({ x: undefined, y: undefined });

const onTouchStart = (e: TouchEvent) => {
  const { clientX, clientY } = e.touches[0];
  start.value = { x: clientX, y: clientY };
  timer.value = setTimeout(() => {
    emit('longTouch');
  }, delay);
}

const onTouchMove = (e: TouchEvent) => {
  const { clientX, clientY } = e.touches[0];
  const diffX = Math.abs(clientX - start.value.x);
  const diffY = Math.abs(clientY - start.value.y);

  if (diffX >= 1 || diffY >= 1) {
    clearTimeout(timer.value);
  }
}

const onTouchEnd = () => {
  clearTimeout(timer.value);
}
</script>

