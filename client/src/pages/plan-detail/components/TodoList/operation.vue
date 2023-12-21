<template>
  <div class="plan-detail-operation" :class="{ touch: touching }" @touchstart="touching = true"
    @touchend="touching = false">
    <div class="icon-wrap">
      <Ident v-if="focus" size="small" />
      <div v-else class="add-icon"></div>
    </div>
    <input class="operation-text" :class="{ focus: focus }" placeholder="下一步" v-model="value"
      :placeholderClass="focus ? 'focus-placeholder' : 'input-placeholder'" :focus="!!focus" @focus="focus = true"
      @blur="handleOnBlur" @confirm="handleOnConfirm" />
  </div>
</template>

<script lang="ts" setup>
import Ident from '@/components/Ident/index.vue';
import { usePlanStore } from '@/stores/plan';
import { usePlanDetailStore } from '@/stores/planDetail';
import { reactive, toRefs } from 'vue';

export interface Props {
  // checkedBackgroundColor?: string; // 选中后的背景颜色
}

const store = usePlanStore();
const detailStore = usePlanDetailStore();

const data = reactive({
  value: '',
  focus: false,
  touching: false,
});

const handleOnBlur = (e) => {
  const value = e.detail.value.trim() as string;
  data.focus = false;

  if (value) {
    data.value = '';
    uni.vibrateShort({ type: 'heavy' });
    store.addStep(detailStore.plan.plan_no, value);
  }
};

const handleOnConfirm = (e) => {
  const value = e.detail.value.trim() as string;
  if (value) {
    setTimeout(() => {
      data.focus = true
    }, 300);
  }
}

const { focus, value, touching } = toRefs(data);
</script>

<style lang="scss">
.plan-detail-operation {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;

  &.touch {
    background-color: #ecf0f1;
  }

  .icon-wrap {
    display: flex;
    width: 50rpx;
    height: 50rpx;
    align-items: center;
    justify-content: center;
  }

  .add-icon {
    width: 32rpx;
    height: 32rpx;
    position: relative;

    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      width: 100%;
      height: 5rpx;
      border-radius: 200rpx;
      background-color: $themeGreen;
    }

    &::after {
      transform: translateY(-50%);
    }

    &::before {
      transform: translateY(-50%) rotate(90deg);
    }
  }

  .operation-text {
    flex: 1;
    margin-left: 30rpx;
    font-size: 30rpx;
    transform: translateY(2rpx);
  }

  .input-placeholder,
  .operation-text input::-webkit-input-placeholder {
    color: $themeGreen;
  }

  .focus-placeholder,
  .operation-text.focus input::-webkit-input-placeholder {
    color: #757575;
  }
}
</style>
