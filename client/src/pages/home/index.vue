<template>
  <div class="home">
    <Headers :day="day" @click-logo="handleClickLogo" />
    <Banner :percentage="getTodayPercentage()" :finishCount="getTodayFinishCount()" :total="getTodayCount()"
      :on-click="intoPlanList" />
    <Contents :items="[
      { label: '进行中', value: inProgressCount },
      { label: '总数', value: store.planList.length },
    ]" />
    <FooterBtn content="所有计划" :onClick="intoPlanList" />
    <AnimationRain :icon="animaIcon" :show="showAnimaRain" />
    <!-- 预加载"我的一天"背景图，此页面不做展示 -->
    <image v-if="!!todayBg" class="today-bg-transparent" :src="todayBg"></image>
  </div>
</template>

<script lang="ts" setup>
import AnimationRain, { AnimationRainProps } from '@/components/AnimationRain/index.vue';
import { PlanTypeEnum } from '@/constants/enum';
import { globalService, planService, userService } from '@/services';
import { usePlanStore } from '@/stores/plan';
import { getGlobalData, initCloud, setGlobalData } from '@/utils/common';
import { isSameDay } from '@/utils/day';
import { getStorageSync, setStorageSync } from '@/utils/storage';
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app';
import { computed, reactive, ref, toRefs } from 'vue';
import Banner from './components/Banner/index.vue';
import Contents from './components/Contents/index.vue';
import FooterBtn from './components/FooterBtn/index.vue';
import Headers from './components/Header/index.vue';

export interface State {
  footerBtnTxt: string;
  day?: number;
  /** 不是当天则会有落雨动画 */
  showAnimaRain?: boolean;
  finishCount: number;
  todayBg: string;
  animaIcon?: AnimationRainProps['icon'];
}

const christmasDay = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  if (month === 12 && day === 25) {
    return true
  } else {
    return false;
  }
}


const store = usePlanStore();

const showed = ref(false);
const data = reactive<State>({
  footerBtnTxt: '',
  day: 1,
  finishCount: 0,
  todayBg: '',
  showAnimaRain: false,
  animaIcon: christmasDay() ? 'christmas' : 'logo'
});

const init = async () => {
  const userId = getStorageSync('user_id');
  uni.showLoading({ title: '加载中...', mask: true });

  // request('planinfo', { action: 'resetPlan' });

  if (!userId) {
    const data = await globalService.login();
    setGlobalData({ user_id: data });
    setStorageSync('user_id', data);

    init();
    return;
  } else {
    setGlobalData({ user_id: userId });
  }

  await fetchUserDay();
  fetchPlanList();
  fetchTodayBgImg();
  uni.hideLoading();
};

onLoad(() => {
  initCloud();
  init();
});

onShow(async () => {
  if (showed.value) {
    // 获取最新天数和计划
    await fetchUserDay();
    fetchPlanList();
  }
  showed.value = true;
});

onShareAppMessage(() => {
  return {}
})

const fetchUserDay = async () => {
  const { day, update_time_day } = await userService.getUserDay(getGlobalData('user_id'));
  data.day = day;

  verifyUpdateDayTime(update_time_day);
};

const verifyUpdateDayTime = (newTime: number) => {
  const storgDayTime = getStorageSync('update_day');
  if (typeof storgDayTime === 'undefined') {
    data.showAnimaRain = true;
  } else {
    data.showAnimaRain = !isSameDay(Number(storgDayTime), Number(newTime));
  }

  if (newTime) {
    setStorageSync('update_day', newTime);
  }
}

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

const getTodayCount = () => store.planList.length;

const inProgressCount = computed(() => {
  return store.planList.filter(m => !m.is_finish).length;
})

const getTodayFinishCount = () =>
  store.planList.filter((m) => m.is_finish).length;

const getFinishCount = () => store.planList.filter((m) => m.is_finish).length;

const getTodayPercentage = () => {
  return Math.floor((getTodayFinishCount() / getTodayCount()) * 100) || 0;
};

const intoPlanList = () => {
  uni.navigateTo({
    url: `/pages/plan-list/index?type=${PlanTypeEnum.all}`,
  });
};

const handleClickLogo = async () => {
  const emial = 'cleves0315@foxmail.com'
  const res = await uni.showModal({
    title: '感谢支持',
    content: `意见投稿: \n${emial}`,
    cancelText: '确定',
    confirmText: '复制邮箱'
  })

  if (res.confirm) {
    uni.setClipboardData({ data: emial });
  }
}

const { day, todayBg, animaIcon, showAnimaRain } = toRefs(data);
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
