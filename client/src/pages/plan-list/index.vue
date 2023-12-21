<template>
  <div class="plan-list-page" :class="{ 'no-scroll': store.touching === 'horizontal' }">
    <CustomNavigationBar :title="naviBarTitle()" :bgColor="decorateBgColor()" :onBack="handleNaviBarBack" />
    <Headers :title="naviBarTitle()" />
    <PlanList :list="todoList" :strongIndex="strongIndex" @long-touch-item="handleOnLongTouchListItem" />
    <MarkBtn class-name="mark-btn" :direction="checkFinish" :onClick="handleClickMark" />
    <PlanList :visibility="checkFinish" :list="finisheList()" />
    <FooterInput inputPlaceTxt="添加任务" :confirm="handleConfrim" />
  </div>
</template>

<script lang="ts" setup>
import CustomNavigationBar from '@/components/CustomNavigationBar/index.vue';
import FooterInput from '@/components/FooterInput/index.vue';
import { PlanTypeEnum } from '@/constants/enum';
import { usePlanStore } from '@/stores/plan';
import { IPlan } from '@/types/plan';
import { getGlobalData } from '@/utils/common';
import { computed, onBeforeMount, reactive, toRefs } from 'vue';
import Headers from './components/Header/index.vue';
import MarkBtn from './components/MarkBtn/index.vue';
import PlanList from './components/PlanList/index.vue';

export interface Props {
  type: string;
}

interface State {
  backUrl: string;
  planList: IPlan[];
  checkFinish: boolean;
  strongIndex: number
}

const store = usePlanStore();

const props = defineProps<Props>();
const { type } = props;

const data = reactive<State>({
  backUrl: type === PlanTypeEnum.today ? getGlobalData('todayBack') : '',
  planList: [],
  checkFinish: false,
  strongIndex: -1,
});

const plnaList = () => {
  return store.planList.filter((m) => type === PlanTypeEnum.all || m.type === PlanTypeEnum.today);
};

onBeforeMount(() => {
  // 数据结构更新
  // request('planinfo', { action: 'resetPlan', user_id: getStorageSync('user_id') });
});

const naviBarTitle = () => (type === PlanTypeEnum.all ? '计划列表' : '我的一天');

const decorateBgColor = () => (type === PlanTypeEnum.today ? 'transparent' : '');

// 获取未完成计划列表
const todoList = computed(() => {
  return plnaList()
    .filter((plan) => !plan.is_finish).sort((x, y) => y.top_time || 0 - x.top_time || 0)
});

// 获取已完成计划列表
const finisheList = () => {
  return plnaList()
    .filter((plan) => plan.is_finish);
};

const handleNaviBarBack = () => {
  uni.navigateBack();
};

const handleClickMark = () => {
  data.checkFinish = !data.checkFinish;
};

const handleConfrim = (val: string) => {
  if (!val?.trim()) {
    return;
  }
  uni.vibrateShort({ type: 'heavy' });
  store.addPlan(val, type as PlanTypeEnum);
};

const handleOnLongTouchListItem = async (plan: IPlan, index: number) => {
  data.strongIndex = index;
  uni.vibrateShort({ type: 'heavy' });
  const itemList = [plan.top_time ? '取消置顶' : '置顶', '删除'];

  try {
    const { tapIndex } = await uni.showActionSheet({
      title: plan.title,
      itemList: itemList,
    })

    switch (tapIndex) {
      case 0:
        store.setTop(plan.plan_no);
        break;
      case 1:
        const res = await uni.showModal({ title: plan.title, content: '确定删除该计划？', })
        if (res.confirm === true) {
          store.delPlan(plan.plan_no);
          uni.showToast({ title: '删除成功', icon: 'none', })
        }
        break;

      default:
        break;
    }
  } catch (error) {
  } finally {
    strongIndex.value = -1;
  }
  console.log('dataa: ', data);

}

const { backUrl, checkFinish, strongIndex } = toRefs(data);
</script>

<style lang="scss">
.plan-list-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 30rpx;
  padding-bottom: 200rpx;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  background: no-repeat #70c59e 0/100% 100%;

  &.no-scroll {
    overflow-y: hidden;
  }

  .mark-btn {
    margin: 35rpx 20rpx;
  }
}

.scroll-div {
  overflow-anchor: auto;
}
</style>
