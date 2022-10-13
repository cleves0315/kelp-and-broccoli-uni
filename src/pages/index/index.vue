<template>
  <button @click="onClick">点我</button>
</template>

<script lang="ts" setup>
const onClick = () => {
  uni.navigateTo({
    url: '/pages/two/two'
  })
}
</script>

<style lang="scss">
.plan-detail {
  padding: 40rpx 0 80rpx;
}
</style>
