<template>
  <div
    class="operation"
    :class="{ touch: touching }"
    @touchstart="touching = true"
    @touchend="touching = false"
  >
    <div class="icon-wrap">
      <Ident v-if="focus" size="small" />
      <div v-else class="add-icon"></div>
    </div>
    <input
      class="operation-text"
      :class="{ focus: focus }"
      placeholder="下一步"
      :value="value"
      :placeholderClass="focus ? 'focus-placeholder' : undefined"
      @focus="focus = true"
      @blur="handleOnBlur"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import Ident from '@/components/Ident/index.vue';


const data = reactive({
  value: '',
  focus: false,
  touching: false,
});

const handleOnBlur = (e: any) => {
  const value = e.detail.value.trim() as string;
  data.focus = false;

  if (value) {
    data.value = '';
  }
};

const { focus, value, touching } = toRefs(data);
</script>

<style lang="scss">
$overdueRed: #d03c35; // 过期红
$themeGreen: #07b45b; // 主题绿

.todo-list .operation {
  display: flex;
  align-items: center;
  padding: 30px 40px;

  &.touch {
    background-color: #ecf0f1;
  }

  .icon-wrap {
    display: flex;
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
  }
  .add-icon {
    width: 32px;
    height: 32px;
    position: relative;

    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      width: 100%;
      height: 5px;
      border-radius: 200px;
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
    margin-left: 30px;
    font-size: 30px;
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
