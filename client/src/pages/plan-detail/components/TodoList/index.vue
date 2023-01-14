<template>
  <div class="todo-list">
    <div class="head">
      <div class="ident-wrap">
        <Ident :checked="detailStore.plan.is_finish" :onClick="handleChangeState" />
      </div>
      <div class="head-title-wrap">
        <input
          class="head-title"
          :class="{ finished: detailStore.plan.is_finish }"
          :value="detailStore.plan.title"
          @blur="handleBlur"
        />
      </div>
    </div>
    <template v-for="step in detailStore.plan.step_list" :key="step.id">
      <Step :step="step" />
    </template>
    <Operation />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
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

  .head-title-wrap {
    $padLeft: 30rpx;
    position: relative;
    margin-left: $padLeft;
    flex: 1;
    overflow: hidden;

    .head-title {
      flex: 1;
      font-size: 40rpx;
      font-weight: 700;

      &.finished {
        color: #757575;
        text-decoration: line-through;
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
