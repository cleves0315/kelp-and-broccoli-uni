<template>
  <div class="describe-wrap">
    <textarea
      class="describe"
      :autoHeight="true"
      placeholder="添加备注"
      :value="detailStore.plan.detail"
      @blur="handleDescribeBlur"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const handleDescribeBlur = (e) => {
  const value = e.detail.value.trim() as string;

  store.editPlan(detailStore.plan.plan_no, {
    detail: value,
  });
};
</script>

<style lang="scss">
.describe-wrap {
  padding: 0 40px;

  .describe {
    width: 100%;
    min-height: 180px;
    font-size: 30px;
    padding: 30px 0;
    color: #767678;
    border-bottom: 2px solid #ededed;

    textarea {
      font-size: 30px;
    }
  }
  .textarea-placeholder,
  .describe::-webkit-input-placeholder {
    color: #767678;
  }
}
</style>
