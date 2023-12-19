<template>
  <div class="describe-wrap">
    <textarea class="describe" :autoHeight="true" placeholder="添加备注" :cursor-spacing="12" :value="detailStore.plan.detail"
      @blur="handleDescribeBlur" maxlength="200"></textarea>
  </div>
</template>

<script lang="ts" setup>
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const handleDescribeBlur = (e) => {
  const value = e.detail.value.trim() as string;

  store.updatePlan(detailStore.plan.plan_no, {
    detail: value,
  });
};
</script>

<style lang="scss">
.describe-wrap {
  padding: 0 40rpx;

  .describe {
    width: 100%;
    min-height: 180rpx;
    font-size: 30rpx;
    padding: 30rpx 0;
    color: #767678;
    border-bottom: 2rpx solid #ededed;

    textarea {
      font-size: 30rpx;
    }
  }

  .textarea-placeholder,
  .describe::-webkit-input-placeholder {
    color: #767678;
  }
}
</style>
