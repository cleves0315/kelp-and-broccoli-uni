<template>
  <div class="plan-detail">
    <TodoList />
    <List :onClick="(type) => onListClick(type)" />
    <Describe />
    <Footers />
    <CalendarModal :show="showCalendarModal" :onBack="onCalendarModalBack" :chioceTime="onChioceTime" />
    <PickerTime :show="showTime" :currentDate="{ year: 2022, month: 10, day: 4 }" :onBack="onPickerTimeBack" :onClose="onPickerTimeClose" />
  </div>
</template>

<script lang="ts" setup>
import CalendarModal from './components/CalendarModal/index.vue';
import TodoList from './components/TodoList/index.vue';
import List, { TypeEnum } from './components/List/index.vue';
import Describe from './components/Describe/index.vue';
import Footers from './components/Footer/index.vue';
import PickerTime from './components/picker-time/index.vue';
import { reactive, toRefs } from 'vue';

const data = reactive({
  showCalendarModal: false,
  showTime: false,
})

const onListClick = async (type: TypeEnum) => {
  remindActionSheet()
};

/**
 * 提醒功能的时间选择列表
 * @todo 开启actionSheet组件
 */
const remindActionSheet = async () => {
  // 晚些时候 => 当前时间后延4小时，舍去分钟
  // 明天  =>  第二天9:00
  // 14400000  间隔4小时时间戳
  // 32400000  间隔9小时时间戳
  // 86400000  间隔一天时间戳
  // 604800000  间隔一周时间戳
  const sheetList: string[] = []; // ActionSheet选项列表
  const sheetDataList: number[] = []; // ActionSheet选项值对应的时间戳

  // 当前时间
  const curntDate = new Date();
  const curntYear = curntDate.getFullYear();
  const curntMonth = curntDate.getMonth();
  const curntDay = curntDate.getDate();
  const curntHour = curntDate.getHours();

  // 当天时间的09:00:00时间戳
  const curntNineOclockTime = new Date(curntYear, curntMonth, curntDay, 9).getTime();

  // 三个固定值的时间戳 与显示的文本
  let later = 0,
    laterHourse: number,
    tomorrow: number,
    nextWeek = 0;
  let laterTxt = '',
    tomorrowTxt = '',
    nextWeekTxt = '';
  let tomrThisDayTxt: string,
    nextThisWeekTxt = '';
  const weekTList = {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
  };

  laterHourse = curntHour + 4;
  if (laterHourse < 24) {
    // 晚些时候时间戳
    later = new Date(curntYear, curntMonth, curntDay, laterHourse).getTime();
    // 如果不是两位数字，在前面加个0
    if (laterHourse >= 10) {
      laterTxt = `${laterHourse}:00`;
    } else {
      laterTxt = `0${laterHourse}:00`;
    }
  }

  tomorrow = curntNineOclockTime + 86400000; // '明天选项'时间戳
  nextWeek = curntNineOclockTime + 604800000; // '下周选项'时间戳
  tomrThisDayTxt = weekTList[new Date(tomorrow).getDay()];
  nextThisWeekTxt = weekTList[new Date(nextWeek).getDay()];
  tomorrowTxt = `明天（${tomrThisDayTxt}09:00）`;
  nextWeekTxt = `下周（${nextThisWeekTxt}09:00）`;

  // 保存当前选项的列表，和对应的时间戳
  // ['晚些时候 (13:00)', '明天 (周二9:00)', '下周 (周一9:00)', '选择日期和时间']
  if (laterTxt) {
    sheetList.push(`晚些时候（${laterTxt}）`);
    sheetDataList.push(later);
  }
  sheetList.push(tomorrowTxt);
  sheetDataList.push(tomorrow);
  sheetList.push(nextWeekTxt);
  sheetDataList.push(nextWeek);
  sheetList.push('选择日期和时间');

  uni.showActionSheet({
    alertText: '提醒',
    itemList: sheetList,
    success: res => {
      const index = res.tapIndex;
      if (sheetList[index] === '选择日期和时间') {
        data.showCalendarModal = true
      } else {
        const sheetTime = sheetDataList[index]; // 这个选项对应的时间戳
      }
    }
  });
};

/**
 * 截止日期选项
 */
const endDateActionSheet = async () => {
  const time = new Date().getTime();

  try {
    const { tapIndex } = await Taro.showActionSheet({
      itemList: ['今天', '明天', '下周', '选择日期'],
    });

    switch (tapIndex) {
      case 0:
        const y = new Date().getFullYear();
        const m = new Date().getMonth() + 1;
        const d = new Date().getDate();
        const lastTime = new Date(`${y}-${m}-${d} 23:59:59`).getTime();
        store.editPlan(detailStore.plan.plan_no, {
          closing_date: lastTime,
        });
        break;
      case 1:
        store.editPlan(detailStore.plan.plan_no, {
          closing_date: time + 86400000, // 当前时间的明天'时间戳'
        });
        break;
      case 2:
        store.editPlan(detailStore.plan.plan_no, {
          closing_date: time + 604800000, // 当前时间的下周'时间戳'
        });
        break;
      case 3:
        // 选择日期
        detailStore.setCalendarModalConfig({
          show: true,
          mark: 'end',
          showTimeColumn: false,
        });
        break;
    }
  } catch (error) {}
};

/** 点击选择时间 */
const onChioceTime =() => {
  data.showTime = true
}

/** 点击日历弹窗返回按钮 */
const onCalendarModalBack = () => {
  data.showCalendarModal = false;
  remindActionSheet();
};

const onPickerTimeBack= () => {
  data.showTime = false
  data.showCalendarModal = true
}

const onPickerTimeClose= () => {
  data.showTime = false
}

const { showCalendarModal, showTime } = toRefs(data)
</script>

<style lang="scss">
.plan-detail {
  padding: 40rpx 0 80rpx;
}
</style>
