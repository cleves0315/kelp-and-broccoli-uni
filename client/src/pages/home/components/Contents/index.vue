<template>
  <div class="contents">
    <div class="container">
      <div class="title">- {{ title }} -</div>
      <div class="main">
        <div class="item" v-for="(item, index) in items" :key="index">
          <div class="num">{{ item.value }}</div>
          <div class="name">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';

export interface Props {
  items: { label: string; value: string | number }[];
}

const data = reactive({
  title: '总计划详情',
});

const { items = [] } = defineProps<Props>();

const { title } = toRefs(data);
</script>

<style lang="scss">
.contents {
  .container {
    padding: 76rpx 0;
  }

  .title {
    color: #b9bcc8;
    font-size: 24rpx;
    font-weight: 600;
    text-align: center;
  }

  .main {
    display: flex;
    margin-top: 40rpx;
  }

  .main .item {
    flex: 1;
    text-align: center;
  }

  .main .item .num {
    font-size: 60rpx;
  }

  .main .item .name {
    font-size: 24rpx;
  }
}
</style>
