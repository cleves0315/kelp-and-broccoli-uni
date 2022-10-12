<template>
  <template v-for="step in [1,2,3]" :key="step.id">
    <div class="step" :class="{ touch: touching }" @touchstart="touching = true" @touchend="touching = false">
      <div class="ident-wrap">
        <Ident size="small" />
      </div>
      <input class="step-title" :value="step"  />
      <div class="del-btn-wrap" ><div class="del-btn"></div></div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import Ident from '@/components/Ident/index.vue';
import { IStep } from '@/types/plan';
import { reactive, toRefs } from 'vue';


const data = reactive({
  focus: false,
  touching: false,
});

const { touching } = toRefs(data);
</script>

<style lang="scss">
$overdueRed: #d03c35; // 过期红
$themeGreen: #07b45b; // 主题绿

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
