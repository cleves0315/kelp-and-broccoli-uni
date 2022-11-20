<template>
  <div class="ident" :class="{ checked: checked, [size]: size }" @click="handleTap">
    <div :class="checked ? 'ident-checked' : 'ident-hidden'"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
export interface Props {
  checked?: boolean; // 当前是否选中
  onClick?: () => void;
  size?: 'normal' | 'small';
}

const { checked = false, size = 'normal', onClick } = defineProps<Props>();

const handleTap = () => {
  if (onClick) {
    uni.vibrateShort({
      // @ts-ignore
      type: 'heavy',
    });
    onClick();
  }
};
</script>

<style lang="scss">
.ident {
  width: 50rpx;
  height: 50rpx;
  overflow: hidden;
  border-radius: 50%;
  box-sizing: border-box;
  border: 4rpx solid #8d8d8d;

  &.small {
    width: 40rpx;
    height: 40rpx;
  }

  &.checked {
    border: 0;
  }

  .ident-checked {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background-color: $themeGreen;
  }

  .ident-hidden {
    visibility: hidden;
  }

  .ident-checked::after {
    content: '';
    width: 60%;
    height: 60%;
    background: url(https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/icon.svg?sign=9326be99b7e582c0ef69cb05f00eca22&t=1599457379)
      no-repeat 0 / 100% 100%;
  }
}
</style>
