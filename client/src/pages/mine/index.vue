<template>
  <view class="mine-page">
    <MineHeader />
    <view class="card-wrapper">
      <MineCard />
    </view>
  </view>
</template>

<script lang="ts" setup>
import MineHeader from './components/mine-header/index.vue';
import MineCard from './components/mine-card/index.vue';
</script>

<style lang="scss">
.mine-page {
  min-height: 100vh;
  overflow: hidden;
  background-color: #f8f8f8;

  .card-wrapper {
    transform: translate(35rpx, -35rpx);
  }
}
</style>
