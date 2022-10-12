<template>
  <div class="todo-list">
    <div class="head" :class="{ touch: touching }" @touchstart="touching = true" @touchend="touching = false">
      <div class="ident-wrap">
        <Ident  />
      </div>
      <input class="head-title" />
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



const data = reactive({
  focus: false,
  touching: false,
});


const { touching } = toRefs(data);
</script>

<style lang="scss">
$overdueRed: #d03c35; // 过期红
$themeGreen: #07b45b; // 主题绿

.todo-list {
  .head {
    display: flex;
    align-items: center;
    padding: 20px 40px;

    &.touch {
      background-color: #ecf0f1;
    }
  }
  .head-title {
    flex: 1;
    margin-left: 30px;
    font-size: 40px;
    font-weight: 700;
  }

  .ident-wrap {
    display: flex;
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
  }
}
</style>
