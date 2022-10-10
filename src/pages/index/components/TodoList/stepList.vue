<template>
  <template v-for="step in detailStore.plan.step_list" :key="step.id">
    <div class="step" :class="{ touch: touching }" @touchstart="touching = true" @touchend="touching = false">
      <div class="ident-wrap">
        <Ident size="small" :checked="step.is_finish" :onClick="() => handleChangeState(step)" />
      </div>
      <input class="step-title" :value="step.title" @blur="handleBlur(step.id, $event)" />
      <div class="del-btn-wrap" @click="handleDelete(step.id)"><div class="del-btn"></div></div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import Ident from '@/components/Ident/index.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { IStep } from '@/types/plan';
import Taro from '@tarojs/taro';
import { reactive, toRefs } from 'vue';

export interface Props {
  // checkedBackgroundColor?: string; // 选中后的背景颜色
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const data = reactive({
  focus: false,
  touching: false,
});

const handleChangeState = (step: IStep) => {
  store.editStep(detailStore.plan.plan_no, step.id, {
    is_finish: !step.is_finish,
  });
};

const handleBlur = (stepId: string, e) => {
  const value = e.detail.value.trim() as string;

  store.editStep(detailStore.plan.plan_no, stepId, {
    title: value,
  });
};

const handleDelete = async (stepId: string) => {
  // 震动
  Taro.vibrateShort();

  try {
    await Taro.showActionSheet({
      itemList: ['删除计划'],
      itemColor: '#EA3927',
    });

    store.delStep(detailStore.plan.plan_no, stepId);
  } catch (error) {
    console.log(error);
  }
};

const { touching } = toRefs(data);
</script>

<style lang="scss">
@import '@/styles/global.scss';

.todo-list .step {
  display: flex;
  align-items: center;
  padding: 20px 40px;

  &.touch {
    background-color: #ecf0f1;
  }

  .ident-wrap {
    display: flex;
    width: 50px;
    justify-content: center;
  }
  .step-title {
    flex: 1;
    margin-left: 30px;
    font-size: 32px;
  }

  .del-btn-wrap {
    position: relative;
    width: 50px;
    height: 50px;
  }
  .del-btn::after,
  .del-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    width: 48%;
    height: 2px;
    border-radius: 999px;
    background: #7c7c80;
  }
  .del-btn::after {
    transform: translateY(-50%) rotate(45deg);
  }
  .del-btn::before {
    transform: translateY(-50%) rotate(-45deg);
  }
}
</style>
