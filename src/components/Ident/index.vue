<template>
  <view class="ident" :class="{ checked: checked, [size]: size }" @click="handleTap">
    <view :class="checked ? 'ident-checked' : 'ident-hidden'"></view>
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { defineProps } from 'vue';
export interface Props {
  checked?: boolean; // 当前是否选中
  // checkedBackgroundColor?: string; // 选中后的背景颜色
  onClick?: () => void;
  size?: 'normal' | 'small';
}

const { checked = false, size = 'normal', onClick } = defineProps<Props>();

const handleTap = () => {
  if (onClick) {
    Taro.vibrateShort({
      // @ts-ignore
      type: 'heavy',
    });
    onClick();
  }
};
</script>

<style lang="scss">
@import '@/styles/global.scss';

.ident {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  box-sizing: border-box;
  border: 4px solid #8d8d8d;

  &.small {
    width: 40px;
    height: 40px;
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
