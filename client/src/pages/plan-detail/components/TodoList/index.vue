<template>
  <div class="todo-list">
    <div class="head" :class="{ touch: touching }" @touchstart="touching = true" @touchend="touching = false">
      <div class="ident-wrap">
        <Ident :checked="detailStore.plan.is_finish" :onClick="handleChangeState" />
      </div>
      <input class="head-title" :value="detailStore.plan.title" @blur="handleBlur" />
    </div>
    <StepList />
    <Operation />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import Ident from '@/components/Ident/index.vue';
import StepList from './stepList.vue';
import Operation from './operation.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';

export interface Props {
  // checkedBackgroundColor?: string; // 选中后的背景颜色
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const data = reactive({
  focus: false,
  touching: false,
});

const handleChangeState = () => {
  store.updatePlan(detailStore.plan.plan_no, {
    is_finish: !detailStore.plan.is_finish,
  });
};

const handleBlur = (e) => {
  const value = e.detail.value as string;

  if (value) {
    store.updatePlan(detailStore.plan.plan_no, {
      title: value.trim(),
    });
  }
};

const { touching } = toRefs(data);
</script>

<style lang="scss">
.todo-list {
  .head {
    display: flex;
    align-items: center;
    padding: 20rpx 40rpx;

    &.touch {
      background-color: #ecf0f1;
    }
  }
  .head-title {
    flex: 1;
    margin-left: 30rpx;
    font-size: 40rpx;
    font-weight: 700;
  }

  .ident-wrap {
    display: flex;
    width: 50rpx;
    height: 50rpx;
    align-items: center;
    justify-content: center;
  }
}
</style>
