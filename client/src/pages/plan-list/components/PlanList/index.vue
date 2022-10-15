<template>
  <div class="plan-list" :class="{ hidden: !props.visibility }">
    <!-- :style="{ height: _height !== null ? `${_height}rpx` : 'auto' }" -->
    <div ref="planListRef">
      <template v-for="plan in props.list" :key="plan.plan_no">
        <PlanItem id="planItem" ref="planItem" :plan="plan" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPlan } from '@/types/plan';
import { reactive, defineProps, ref, onBeforeMount } from 'vue';
import PlanItem from '../PlanItem/index.vue';

export interface Props {
  list?: IPlan[];
  visibility?: boolean;
}

const planListRef = ref(null) as any;
const props = withDefaults(defineProps<Props>(), {
  visibility: true,
});

const data = reactive({
  _height: null,
});

onBeforeMount(() => {
  // 获取 DomRect
  // Taro小程序环境下这里必须延迟才能获取到
  setTimeout(() => {
    getListHeight();
  }, 500);
});

const getListHeight = async () => {
  console.log('planListRef?.value: ', planListRef?.value);

  // const { height } = await planListRef?.value?.getBoundingClientRect();
  // data._height = height;
};
</script>

<style lang="scss">
.plan-list-page {
  .plan-list {
    padding: 0 20px;
    box-sizing: border-box;
    overflow: hidden;
    transition: height 0.3s ease;

    &.hidden {
      height: 0 !important;
    }
  }

  // 关闭滚动条样式
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
}
</style>
