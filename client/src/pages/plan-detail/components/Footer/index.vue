<template>
  <div class="plan-detial-footer">
    <div class="plan-detial-footer-wrapper">
      <div class="content" :class="{ finished: detailStore.plan.is_finish }">
        {{ beforeTime() }} {{ formatDate() }}
      </div>
      <div class="del-btn" @click="handleClick"></div>
    </div>
    <IphoneBottomSideAdapter />
  </div>
</template>

<script lang="ts" setup>
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import IphoneBottomSideAdapter from '@/components/IphoneBottomSideAdapter/index.vue';

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const beforeTime = () => {
  if (detailStore.plan.is_finish) {
    return '完成于';
  }
  return '创建于';
};

/**
 *  根据传入的时间戳返回一定格式的日期文字
 * @return 返回格式 xx年xx月xx日 周x
 */
const formatDate = () => {
  const date = new Date(detailStore.plan.create_time);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = date.getDay();
  let wee = '',
    dateString = '';

  switch (w) {
    case 0:
      wee = '周日';
      break;
    case 1:
      wee = '周一';
      break;
    case 2:
      wee = '周二';
      break;
    case 3:
      wee = '周三';
      break;
    case 4:
      wee = '周四';
      break;
    case 5:
      wee = '周五';
      break;
    case 6:
      wee = '周六';
      break;
  }

  if (y !== new Date().getFullYear()) {
    dateString = y + '年' + m + '月' + d + '日 ' + wee;
  } else {
    dateString = m + '月' + d + '日 ' + wee;
  }

  return dateString;
};

const handleClick = async () => {
  // 两下震动
  uni.vibrateShort({ type: 'heavy' } as any);
  setTimeout(() => uni.vibrateShort({ type: 'heavy' } as any), 200);

  uni.showActionSheet({
    itemList: ['删除计划'],
    itemColor: '#EA3927',
    success: () => {
      store.delPlan(detailStore.plan.plan_no);
      uni.navigateBack();
    },
  });
};
</script>

<style lang="scss">
.plan-detial-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;

  .plan-detial-footer-wrapper {
    display: flex;
    align-items: center;
    padding: 20rpx 40rpx;
  }

  .content {
    flex: 1;
    color: #767678;
    font-size: 28rpx;
    text-align: center;

    &.finished {
      color: $themeGreen;
    }
  }

  .del-btn {
    width: 40rpx;
    height: 40rpx;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(./del.svg);
  }
}
</style>
