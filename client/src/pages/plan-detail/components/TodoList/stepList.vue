<template>
  <div class="plan-detail-step" :class="{ touch: touching }">
    <div class="ident-wrap">
      <Ident size="small" :checked="step.is_finish" :onClick="handleChangeState" />
    </div>
    <input class="step-title" :class="{ finished: step.is_finish }" :value="step.title" @touchstart="touching = true"
      @touchend="touching = false" @blur="handleBlur" />
    <div class="del-btn-wrap" @click="handleDelete">
      <div class="del-btn"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Ident from '@/components/Ident/index.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { IStep } from '@/types/plan';
import { reactive, toRefs } from 'vue';

export interface Props {
  step: IStep;
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const props = defineProps<Props>();
const { step } = props;

const data = reactive({
  focus: false,
  touching: false,
});

const handleChangeState = () => {
  store.editStep(detailStore.plan.plan_no, step.id, {
    is_finish: !step.is_finish,
  });
};

const handleBlur = (e) => {
  const value = e.detail.value.trim() as string;

  store.editStep(detailStore.plan.plan_no, step.id, {
    title: value,
  });
};

const handleDelete = async (e: MouseEvent) => {
  e.stopPropagation();
  // 震动
  uni.vibrateShort({ type: 'heavy' });

  uni.showActionSheet({
    itemList: ['删除计划'],
    itemColor: '#EA3927',
    success: () => {
      store.delStep(detailStore.plan.plan_no, step.id);
    },
  });
};

const { touching } = toRefs(data);
</script>

<style lang="scss">
.plan-detail-step {
  display: flex;
  align-items: center;
  padding: 20rpx 40rpx;
  padding-right: 0;

  &.touch {
    background-color: #ecf0f1;
  }

  .ident-wrap {
    display: flex;
    width: 50rpx;
    justify-content: center;
  }

  .step-title {
    flex: 1;
    margin-left: 30rpx;
    font-size: 32rpx;

    &.finished {
      color: #757575;
      text-decoration: line-through;
    }
  }

  .del-btn-wrap {
    position: relative;
    width: 106rpx;
    height: 52rpx;
    overflow: hidden;
  }

  .del-btn::after,
  .del-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 26rpx;
    height: 2rpx;
    border-radius: 999rpx;
    background: #7c7c80;
  }

  .del-btn::after {
    transform: translate(-50%) rotate(45deg);
  }

  .del-btn::before {
    transform: translate(-50%) rotate(-45deg);
  }
}
</style>
