<template>
  <div
    class="list-item"
    :class="{ touch: touching }"
    :style="styles"
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
      <div v-if="showClose" class="operate-wrap" @click.stop="handleClose"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, StyleValue, toRefs } from 'vue';

export interface Props {
  icon: string;
  styles?: StyleValue; // 自定义样式
  content: string;
  subtitle?: string;
  hasLine?: boolean;
  showClose?: boolean; // 展示删除按钮
  onClick?: () => void;
  onClose?: () => void;
}

const { icon, styles, content, subtitle, onClick, onClose, hasLine = true } = defineProps<Props>();

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
$height: 110rpx;
$sideSpace: 40rpx;

.list-item {
  height: $height;
  padding-left: $sideSpace;
  padding-right: $sideSpace;
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
    box-sizing: border-box;
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
    margin-right: $sideSpace;

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
    // margin-right: calc((50rpx / -3));

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 22rpx;
      height: 2rpx;
      border-radius: 999rpx;
      background: #7c7c80;
    }
    &::before {
      transform: translate(-50%) rotate(-45deg);
    }
    &::after {
      transform: translate(-50%) rotate(45deg);
    }
  }
}
</style>
