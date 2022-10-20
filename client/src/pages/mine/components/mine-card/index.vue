<template>
  <view class="mine-card">
    <view class="card-title">工具栏</view>
    <view class="case-wrapper">
      <view class="case-wrap" v-for="item in toolsList" :key="item.type" @click="handleClick(item.type)">
        <image class="case-icon" mode="widthFix" :src="item.icon"></image>
        <view class="case-text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import ComputerIcon from '@/assets/mine/computer.png';

const data = reactive({
  toolsList: [{ icon: ComputerIcon, text: '累计最多数', type: 'statistics' }],
});

const handleClick = (type) => {
  switch (type) {
    case 'statistics':
      wx.navigateTo({
        url: `/pages/tool/index?type=${type}`,
      });
      break;

    default:
      break;
  }
};

const { toolsList } = toRefs(data);
</script>

<style lang="scss">
.mine-card {
  padding: 40rpx 30rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .case-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 40rpx;
  }

  .case-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .case-icon {
    width: 60rpx;
  }

  .case-text {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #838383;
  }
}
</style>
