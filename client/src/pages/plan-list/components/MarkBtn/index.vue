<template>
  <div class="v-mark-btn" :class="className" @click="handleClick">
    <image class="icon" :class="{ down: direction }" mode="widthFix" src="./arrow.svg"></image>
    {{ content || '已完成' }}
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';

export type Props = {
  content?: string;
  className?: string;
  direction?: boolean;
  onClick?: () => void;
};

const data = reactive({});

const { content, className, direction, onClick } = defineProps<Props>();

const handleClick = () => {
  onClick?.();
};

const { } = toRefs(data);
</script>

<style lang="scss">
.v-mark-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 50rpx;
  color: #fff;
  font-size: 26rpx;
  border-radius: 10rpx;
  background-color: rgba(0, 0, 0, 0.4);

  .icon {
    display: block;
    width: 22rpx;
    height: 22rpx;
    margin-right: 6rpx;
    transition: transform 0.3s ease;

    &.down {
      transform: rotate(90deg);
    }
  }
}
</style>
