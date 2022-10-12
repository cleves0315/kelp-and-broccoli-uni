<template>
  <div
    class="footer-input"
    :class="{ iphone: isPhone, 'change-height': isFocus }"
    :style="{ background: bgColor, bottom: `${cursorSpacing}px` }"
  >
    <div v-if="showMask" class="footer-input-mask"></div>
    <div class="container" :class="{ 'changing-height': isFocus }">
      <input
        class="input-box"
        :class="{ 'input-changing-height': isFocus }"
        :value="value"
        :placeholder="inputPlaceTxt"
        :maxlength="maxlength"
        :placeholderStyle="isFocus ? 'color: #767678;' : 'color: #fefefe;'"
        :adjust-position="adjustPosition"
        @focus="handleOnFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @keyboardheightchange="handleKeyboardheightchange"
      />
      <div class="input-place">
        <image v-if="!isFocus" class="blur-icon" src="./add.svg"></image>
        <div v-else class="focus-icon"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, reactive } from 'vue';
export interface Props {
  bgColor?: string; // 背景颜色
  inputPlaceTxt?: string; // input[placeholder]属性值
  maxlength?: number; // input[maxlength]属性值
  adjustPosition?: boolean; // 键盘弹起时，是否自动上推页面
  inputPlaceIcon?: string; // input标签提示icon
  confirm?: (value: string) => void; // 提交
}
export interface Data {
  showMask: boolean;
  isPhone: boolean;
  isFocus: boolean;
  cursorSpacing: number; // 获取键盘高度
  value: string; // 设置输入框的值
}

const {
  bgColor,
  inputPlaceTxt = '添加任务',
  maxlength = -1,
  adjustPosition = false,
  // inputPlaceIcon = './add.svg',
  confirm = () => {},
} = defineProps<Props>();

const data: Data = reactive({
  showMask: false,
  isPhone: false,
  cursorSpacing: 0,
  value: '',
  isFocus: false,
});

const handleOnFocus = () => {
  data.isFocus = true;
  data.showMask = true;
};

const handleBlur = () => {
  data.isFocus = false;
  data.showMask = false;

  if (data.cursorSpacing !== 0) {
    data.cursorSpacing = 0;
  }
};

const handleConfirm = (e) => {
  data.value = '';
  confirm(e.detail.value.trim());
};

const handleKeyboardheightchange = (e) => {
  const height = e.detail.height;

  data.isFocus = true;

  if (height > 0) {
    data.cursorSpacing = e.detail.height;
  }
};

const { showMask, isPhone, cursorSpacing, value, isFocus } = toRefs(data);
</script>

<style lang="scss">
.footer-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transition: bottom 0.3s;
  background-color: #70c59e;
  z-index: 9;

  &.iphone {
    padding-bottom: 30px;
  }

  .footer-input-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  /**
  * 激活键盘时
  */
  &.change-height {
    padding-bottom: 0;
  }

  .container {
    position: relative;
    padding: 10px 20px;

    &.changing-height {
      background: #fefefe;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -10px 20px -10px rgba(0, 0, 0, 0.3);

      .input-changing-height {
        color: #767678;
        background: #fefefe;
      }
    }
  }

  .input-box {
    position: relative;
    display: flex;
    align-items: center;
    height: 120px;
    line-height: 120px;
    border-radius: 30px;
    color: #fefefe;
    transition: 0;
    padding-right: 30px;
    padding-left: 104px;
    font-size: 30px;
    background: rgba(0, 0, 0, 0.56);
  }

  /* 激活键盘时end */

  .input-place {
    position: absolute;
    top: 50%;
    left: 50px;
    display: flex;
    align-items: center;
    transform: translateY(-50%);

    .blur-icon {
      width: 46px;
      height: 46px;
      margin-right: 30px;
    }
    .focus-icon {
      width: 46px;
      height: 46px;
      margin-right: 30px;
      border-radius: 50%;
      border: 4px solid #767678;
    }
  }

  .input-changing-height {
    input::-webkit-input-placeholder {
      color: #767678;
    }
  }
  input::-webkit-input-placeholder {
    color: #fefefe;
  }
}
</style>
