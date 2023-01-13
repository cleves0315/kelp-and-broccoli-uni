<template>
  <div class="todo-list">
    <div class="head">
      <div class="ident-wrap">
        <Ident :checked="detailStore.plan.is_finish" :onClick="handleChangeState" />
      </div>
      <input
        class="head-title"
        :class="{ finished: detailStore.plan.is_finish }"
        :style="{ '--timeline-left-width': '100rpx' }"
        :value="detailStore.plan.title"
        @blur="handleBlur"
      />
    </div>
    <template v-for="step in detailStore.plan.step_list" :key="step.id">
      <Step :step="step" />
    </template>
    <Operation />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import Ident from '@/components/Ident/index.vue';
import Step from './stepList.vue';
import Operation from './operation.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';

export interface Props {}

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
    width: var(--timeline-left-width);

    &.finished {
      color: #757575;
      text-decoration: line-through;
      text-decoration-line: line-through;
      -webkit-text-decoration-line: line-through;
      position: relative;

      &::after {
        content: '';
        // position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%) scale(1.5);
        height: 2rpx;
        background-color: #757575;
      }
    }
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
