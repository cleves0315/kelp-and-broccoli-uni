<template>
  <div class="header">
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  title: string;
}

const { title } = defineProps<Props>();
</script>

<style lang="scss">
.header {
  color: #fff;
  font-size: 60rpx;
  font-weight: 700;
  padding: 0 30rpx;
  margin-bottom: 10rpx;
}
</style>
