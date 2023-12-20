<template>
  <div class="footer-input" :class="{ 'changing-height': isFocus }" :style="{ bottom: `${cursorSpacing}px` }">
    <div v-if="showMask" class="footer-input-mask"></div>

    <div class="container">
      <input class="input-box" :class="{ 'input-changing': isFocus }" v-model="value" :maxlength="maxlength"
        :placeholder-class="`input-box-placeholder ${isFocus ? 'focus' : ''}`" :placeholder="inputPlaceTxt"
        :adjust-position="adjustPosition" @focus="handleOnFocus" @blur="handleBlur" @confirm="handleConfirm"
        @keyboardheightchange="handleKeyboardheightchange" />
      <div class="input-place">
        <image v-if="!isFocus" class="blur-icon" src="./add.svg"></image>
        <div v-else class="focus-icon"></div>
      </div>
    </div>

    <template v-if="!isFocus">
      <IphoneBottomSideAdapter />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, reactive } from 'vue';
import IphoneBottomSideAdapter from '../IphoneBottomSideAdapter/index.vue';
export interface Props {
  inputPlaceTxt?: string; // input[placeholder]属性值
  maxlength?: number; // input[maxlength]属性值
  adjustPosition?: boolean; // 键盘弹起时，是否自动上推页面
  inputPlaceIcon?: string; // input标签提示icon
  confirm?: (value: string) => void; // 提交
}
export interface Data {
  showMask: boolean;
  isFocus: boolean;
  cursorSpacing: number; // 获取键盘高度
  value: string; // 设置输入框的值
}

const props = defineProps<Props>();
const {
  inputPlaceTxt = '添加任务',
  maxlength = -1,
  adjustPosition = false,
  // inputPlaceIcon = './add.svg',
  confirm = () => { },
} = props;

const data: Data = reactive({
  showMask: false,
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

const { showMask, cursorSpacing, value, isFocus } = toRefs(data);
</script>

<style lang="scss">
.footer-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transition: bottom 0.3s;
  background-color: #70c59e;
  background-color: transparent;
  z-index: 9;

  &.changing-height {
    background-color: #fefefe;
    border-radius: 20rpx 20rpx 0 0;
    box-shadow: 0 -10rpx 20rpx -10rpx rgba(0, 0, 0, 0.3);

    .input-changing {
      color: #767678;
      background: #fefefe;
    }
  }

  .input-box-placeholder {
    color: #fefefe;
    font-size: 30rpx;

    &.focus {
      color: #767678;
    }
  }

  .footer-input-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .container {
    position: relative;
    padding: 10rpx 20rpx;
  }

  .placeholder-mask {
    position: absolute;
    left: 124rpx;
    top: 50%;
    transform: translateY(-50%);
    color: #fefefe;
    font-size: 30rpx;
    z-index: 1;

    &.focus {
      color: #767678;
    }
  }

  .input-box {
    position: relative;
    width: 100%;
    height: 120rpx;
    line-height: 120rpx;
    border-radius: 30rpx;
    color: #fefefe;
    padding-right: 30rpx;
    padding-left: 104rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.56);
  }

  /* 激活键盘时end */

  .input-place {
    position: absolute;
    top: 50%;
    left: 50rpx;
    display: flex;
    align-items: center;
    transform: translateY(-50%);

    .blur-icon {
      width: 46rpx;
      height: 46rpx;
      margin-right: 30rpx;
    }

    .focus-icon {
      width: 46rpx;
      height: 46rpx;
      margin-right: 30rpx;
      border-radius: 50%;
      border: 4rpx solid #767678;
    }
  }

  .input-changing {
    input::-webkit-input-placeholder {
      color: #767678;
    }
  }

  input::-webkit-input-placeholder {
    color: #fefefe;
  }
}
</style>
