<template>
  <div @touchstart="onTouchStart" @touchend="onTouchEnd">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['longTouch']);

const delay = 500; // ms
const timer = ref();

const onTouchStart = () => {
  timer.value = setTimeout(() => {
    emit('longTouch');
  }, delay);
}

const onTouchEnd = () => {
  clearTimeout(timer.value);
}
</script>

