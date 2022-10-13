<template>
  <div
    class="list-item"
    :class="[{ touch: touching }, className]"
    @touchstart="touching = true"
    @touchend="touching = false"
    @click="handleClick"
  >
    <div class="list-item-wrap" :class="{ 'no-line': !hasLine }">
      <div class="icon-wrap">
        <image class="icon" :src="icon"></image>
      </div>
      <div class="content-wrap">
        <div class="list-item-content">{{ content }}</div>
        <div class="list-item-subtitle">{{ subtitle }}</div>
      </div>
      <div v-if="showClose" class="operate-wrap" @click="handleClose"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, toRefs } from 'vue';

export interface Props {
  icon: string;
  content: string;
  subtitle?: string;
  className?: string; // 自定义类
  hasLine?: boolean;
  showClose?: boolean; // 展示删除按钮
  onClick?: () => void;
  onClose?: () => void;
}

const { icon, content, subtitle, onClick, onClose, hasLine = true, className } = defineProps<Props>();

const data = reactive({
  touching: false,
});

const handleClick = () => {
  onClick?.();
};

const handleClose = (e) => {
  e.stopPropagation();
  onClose?.();
};

const { touching } = toRefs(data);
</script>

<style lang="scss">
.list-item {
  height: 110rpx;
  padding: 0 40rpx;
  overflow: hidden;
  box-sizing: border-box;
  color: #767678;

  &.touch {
    background-color: #ecf0f1;
  }

  .list-item-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: inherit;
    color: inherit;
    border-bottom: 2rpx solid #ededed;

    &.no-line {
      border-bottom: unset;
    }
  }

  .icon-wrap {
    display: flex;
    flex-shrink: 0;
    width: 50rpx;
    height: 50rpx;
    margin-right: 40rpx;

    .icon {
      display: block;
      width: 36rpx;
      height: 36rpx;
      margin: auto;
    }
  }

  .content-wrap {
    flex: 1;
    font-size: 30rpx;
    color: inherit;

    .list-item-content {
      color: inherit;
      font-size: 30rpx;
    }
    .list-item-subtitle {
      color: inherit;
      font-size: 24rpx;
    }
  }

  .operate-wrap {
    position: relative;
    width: 50rpx;
    height: 50rpx;
    flex-shrink: 0;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: 45%;
      height: 2rpx;
      border-radius: 999rpx;
      background: #7c7c80;
    }
    &::before {
      transform: translateY(-50%) rotate(-45deg);
    }
    &::after {
      transform: translateY(-50%) rotate(45deg);
    }
  }
}
</style>
