<template>
  <div class="footer-btn">
    <div class="container">
      <div
        class="wrap"
        :class="{ active: touch }"
        @touchstart="handleToStart"
        @touchend="handleToEnd"
        @click="handleToTap"
      >
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue';
export interface Props {
  content: string;
  onClick: () => void;
}

const { content, onClick } = defineProps<Props>();
const touch = ref(false);

const handleToStart = () => {
  touch.value = true;
};

const handleToEnd = () => {
  touch.value = false;
};

const handleToTap = () => {
  onClick();
};
</script>

<style lang="scss">
.footer-btn {
  .container {
    padding: 40rpx 0;
  }

  .wrap {
    width: 540rpx;
    color: #fff;
    font-size: 36rpx;
    text-align: center;
    background: linear-gradient(to right, #7dc899, #66c3a4);
    border-radius: 50rpx;
    margin: 0 auto;
    padding: 20rpx 0;
    transition: 0.14s linear;
  }

  .active {
    transform: scale(0.8);
  }
}
</style>
