<template>
  <div class="iphone-bottom-side-adapter" :class="{ iphonex: iphonex }"></div>
</template>

<script lang="ts" setup>
import { isIphone } from '@/utils/common';
import { ref } from 'vue';

const iphonex = ref(isIphone());
</script>

<style lang="scss">
.iphone-bottom-side-adapter {
  &.iphonex {
    height: 38rpx;
  }
}
</style>
