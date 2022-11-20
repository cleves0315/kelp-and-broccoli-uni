<template>
  <div class="home">
    <Headers :day="day" />
    <Banner
      :percentage="getTodayPercentage()"
      :finishCount="getTodayFinishCount()"
      :total="getTodayCount()"
    />
    <Contents :finished="finishCount" :progress="store.planList.length - finishCount" />
    <FooterBtn content="所有计划" :onClick="intoPlanList" />
    <!-- 预加载"我的一天"背景图，此页面不做展示 -->
    <image class="today-bg-transparent" :src="todayBg"></image>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import Headers from './components/Header/index.vue';
import Banner from './components/Banner/index.vue';
import Contents from './components/Contents/index.vue';
import FooterBtn from './components/FooterBtn/index.vue';
import { globalService, planService, userService } from '@/services';
import { usePlanStore } from '@/stores/plan';
import { getGlobalData, initCloud, setGlobalData } from '@/utils/common';
import { PlanTypeEnum } from '@/constants/enum';
import { onLoad, onShow } from '@dcloudio/uni-app';

export interface State {
  toBack: boolean;
  footerBtnTxt: string;
  day?: number;
  finishCount: number;
  todayBg: string;
}

const store = usePlanStore();

const data = reactive<State>({
  toBack: false,
  footerBtnTxt: '',
  day: 1,
  finishCount: 0,
  todayBg: '',
});

const init = async () => {
  const userId = uni.getStorageSync('user_id');
  uni.showLoading({ title: '加载中...', mask: true });

  // request('planinfo', { action: 'resetPlan' });

  if (!userId) {
    const data = await globalService.login();
    setGlobalData({ user_id: data });
    uni.setStorageSync('user_id', data);

    init();
    return;
  } else {
    setGlobalData({ user_id: userId });
  }

  fetchUserDay();
  fetchPlanList();
  fetchTodayBgImg();
  uni.hideLoading();
};

onLoad(() => {
  initCloud();
  init();
});

onShow(() => {
  if (data.toBack) {
    // 获取最新天数和计划
    fetchUserDay();
    fetchPlanList();
  }
});

const fetchUserDay = async () => {
  const day = await userService.getUserDay(getGlobalData('user_id'));
  data.day = day;
};

const fetchPlanList = async () => {
  const planList = await planService.getPlanList(getGlobalData('user_id'));
  store.setPlanList(planList);
  data.finishCount = getFinishCount();
};

const fetchTodayBgImg = async () => {
  const url = await planService.getTodayBgImg();
  data.todayBg = url;
  setGlobalData({
    todayBack: url,
  });
};

const getTodayCount = () => store.planList.filter((m) => m.type === PlanTypeEnum.today).length;

const getTodayFinishCount = () =>
  store.planList.filter((m) => m.is_finish && m.type === PlanTypeEnum.today).length;

const getFinishCount = () => store.planList.filter((m) => m.is_finish).length;

const getTodayPercentage = () => {
  return Math.floor((getTodayFinishCount() / getTodayCount()) * 100) || 0;
};

const intoPlanList = () => {
  data.toBack = true;
  uni.navigateTo({
    url: `/pages/plan-list/index?type=${PlanTypeEnum.all}`,
  });
};

const { day, todayBg, finishCount } = toRefs(data);
</script>

<style lang="scss">
.home {
  padding: 56rpx 30rpx;

  .today-bg-transparent {
    width: 0;
    height: 0;
  }
}
</style>
