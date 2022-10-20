<template>
  <view class="mine-header">
    <view class="welcome-wrapper">
      <image
        class="logo-icon"
        mode="widthFix"
        src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli.png?sign=7b6211e60087fd8fb1909cca697cb0a3&t=1612709339"
      ></image>
      <text class="welcome-words">欢迎来到海带与西兰花</text>
    </view>
  </view>
</template>

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
