<template>
  <div
    class="plan-list"
    :class="{ hidden: !props.visibility }"
    :style="{ height: _height !== null ? `${_height}px` : 'auto' }"
  >
    <div id="planListRef">
      <template v-for="plan in props.list" :key="plan.plan_no">
        <PlanItem id="planItem" ref="planItem" :plan="plan" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPlan } from '@/types/plan';
import { reactive, defineProps, onMounted, getCurrentInstance, toRefs, watch } from 'vue';
import PlanItem from '../PlanItem/index.vue';

export interface Props {
  list?: IPlan[];
  visibility?: boolean;
}

const inst = getCurrentInstance();
const query = uni.createSelectorQuery().in(inst);
query.select('#planListRef').boundingClientRect();

const props = withDefaults(defineProps<Props>(), {
  visibility: true,
});

watch(
  () => props.list,
  (newVal) => {
    if (newVal) {
      // 获取最新节点高度
      query.exec(([rect]) => {
        data._height = rect.height;
      });
    }
  },
);

const data = reactive({
  _height: null,
});

onMounted(() => {
  // 获取节点高度
  query.exec(([rect]) => {
    data._height = rect.height;
  });
});

const { _height } = toRefs(data);
</script>

<style lang="scss">
.plan-list {
  padding: 0 20rpx;
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
</style>
