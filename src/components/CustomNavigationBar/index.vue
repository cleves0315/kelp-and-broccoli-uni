<!-- 自定义导航栏 -->
<template>
  <div class="navigation-bar" :class="!height && 'hide'" :style="{ height: `${height}px` }">
    <div class="bg-mask" :style="{ 'background-color': bgColor }"></div>
    <div class="container" :style="{ height: `${rectHieght}px`, top: `${rectTop}px` }">
      <div class="left-side" @click="handleOnBack">
        <image
          class="left-icon"
          mode="widthFix"
          src="@/assets/to_back.svg"
          :style="{ width: `${iconSize}px` }"
        ></image>
        <div class="left-txt">{{ lefSideTxt }}</div>
      </div>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { log, logErr } from '@/utils/log';
import { defineProps, toRefs, reactive } from 'vue';
export interface Props {
  title: string;
  bgColor?: string;
  lefSideTxt?: string;
  onBack?: () => void;
}
export interface Data {
  statusBarHeight: number; // 系统状态栏高度
  height: number; // 组件窗口高度
  iconSize: number; // 按钮大小宽度
  rectHieght: number; // 导航栏胶囊的高度
  rectTop: number; // 系统胶囊定位位置
}

const { title = 'title', bgColor, lefSideTxt, onBack } = defineProps<Props>();

const data: Data = reactive(
  (() => {
    // 获取小程序胶囊高度值 - 计算出组件高度
    try {
      const rect = Taro.getMenuButtonBoundingClientRect();
      const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight || 0;
      const gap = rect.top - statusBarHeight;

      if (!statusBarHeight) {
        throw new Error('获取状态栏高度失败');
      }

      return {
        statusBarHeight,
        height: statusBarHeight + gap * 2 + rect.height,
        iconSize: rect.height - 10,
        rectHieght: rect.height,
        rectTop: rect.top,
      };
    } catch (error) {
      logErr('components -> NavigationBar: ', error.message);

      return {
        statusBarHeight: 0,
        height: 0,
        iconSize: 0,
        rectHieght: 0,
        rectTop: 0,
      };
    }
  })(),
);

const handleOnBack = () => {
  onBack?.();
};

log('NavigationBar[data]: ', data);

const { height, iconSize, rectHieght, rectTop } = toRefs(data);
</script>

<style lang="scss">
$overdueRed: #d03c35; // 过期红
$themeGreen: #07b45b; // 主题绿

.navigation-bar {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  // 高度计算失败，不展示组件
  &.hide {
    display: none;
  }

  .bg-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: inherit;
    background-color: #70c59e;
    z-index: 998;
  }

  .container {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    z-index: 999;
    align-items: center;
    justify-content: center;
    padding-bottom: 2px;
  }

  .left-side {
    position: absolute;
    top: 50%;
    left: 13px;
    transform: translateY(-50%);
  }

  .title {
    color: #fff;
    text-align: center;
    font-weight: 500;
  }
}
</style>
