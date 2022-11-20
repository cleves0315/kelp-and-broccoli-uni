<template>
  <div class="banner">
    <image class="photo" src="./banner.jpg" @click="handleTapBanner">
      <div class="content">
        <div class="banner-title">
          <div class="title">{{ bannerTitle }}</div>
          <div class="right-table">
            <image class="icon" mode="widthFix" src="@/assets/directory.png"></image>
            {{ rightTableTxt }}
          </div>
        </div>
        <div class="progress">
          <div class="progress-title">
            <div class="progress-detail">已完成{{ percentage }}%</div>
            <div class="progress-quantity">{{ finishCount }}/{{ total }}目标</div>
          </div>
          <div class="progress-line">
            <progress
              :percent="percentage"
              stroke-width="4"
              :activeColor="progressActiveColor"
              :backgroundColor="progressBackgroundColor"
            ></progress>
          </div>
        </div>
      </div>
    </image>
  </div>
</template>

<script lang="ts" setup>
import { PlanTypeEnum } from '@/constants/enum';
import { reactive, toRefs } from 'vue';

export interface Props {
  percentage: number;
  finishCount: number;
  total: number;
}

const { percentage, finishCount, total } = defineProps<Props>();

const data = reactive({
  bannerTitle: '我的一天',
  rightTableTxt: '当天计划',
  progressActiveColor: '#2fb38b',
  progressBackgroundColor: 'rgba(238, 238, 238, .4)',
});

const handleTapBanner = () => {
  uni.navigateTo({
    url: `/pages/plan-list/index?type=${PlanTypeEnum.today}`,
  });
};

const { bannerTitle, rightTableTxt, progressActiveColor, progressBackgroundColor } = toRefs(data);
</script>

<style lang="scss">
.banner {
  .photo {
    position: relative;
    display: block;
    width: 100%;
    height: 246rpx;
    border-radius: 38rpx;
    background-color: #49928b;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // background-image: url(./banner.jpg);
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30rpx 0;
  }

  .banner-title {
    display: flex;
    padding-left: 30rpx;
    justify-content: space-between;
  }

  .banner-title .title {
    color: #fff;
    font-size: 36rpx;
    font-weight: 700;
  }

  .content .right-table {
    padding: 10rpx 20rpx;
    color: #fff;
    background: #7fcda0;
    text-align: center;
    font-size: 24rpx;
    border-radius: 20rpx 0 0 20rpx;
    display: flex;
    align-items: center;
    font-weight: 600;
  }

  .content .right-table .icon {
    width: 30rpx;
    max-height: 30rpx;
    margin-right: 2rpx;
  }

  .progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30rpx;
    padding: 0 30rpx;
  }

  .progress-title {
    display: flex;
    font-size: 24rpx;
    font-weight: 600;
    justify-content: space-between;
  }

  .progress-detail,
  .progress-quantity {
    color: #f5f5f6;
  }

  .progress-line {
    margin-top: 10rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
}
</style>
