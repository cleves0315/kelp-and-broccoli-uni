<template>
  <view class="mine-header">
    <view class="welcome-wrapper">
      <image class="logo-icon" mode="widthFix" :src="LOGO_TRANSP_BASE64"></image>
      <text class="welcome-words">欢迎来到海带与西兰花</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { LOGO_TRANSP_BASE64 } from '@/constants';
</script>

<style lang="scss">
.mine-header {
  height: 300rpx;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #ecf0f1;

  .logo-icon {
    width: 60rpx;
    margin-right: 20rpx;
  }

  .welcome-wrapper {
    display: flex;
    height: inherit;
    align-items: center;
  }

  .welcome-words {
    font-size: 36rpx;
    color: #2c2c2c;
  }
}
</style>
