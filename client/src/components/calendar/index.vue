<template>
  <div class="calendar">
    <div class="header">
      <div class="left" v-if="showHeadOperate" @click="handleOnBack">
        <image class="left-icon" mode="widthFix" src="@/assets/to_back_green.svg"></image>
      </div>
      <div class="title">{{ currentYear }} 年 {{ currentMonth }} 月</div>
      <div class="right" @click="handelOnSetting" v-if="showHeadOperate">
        <div class="right-txt">{{ headRightCont }}</div>
      </div>
    </div>
    <div class="week-line">
      <block v-for="(weekLTxt, index) in weekLineTxt" :key="index">
        <div class="item">{{ weekLTxt }}</div>
      </block>
    </div>
    <div class="calendar-case" :style="{ 'background-image': `url(${calBackImage || ''})` }">
      <swiper
        class="calendar-swiper"
        :current="calendarCurrent"
        @change="handleToChangeCalendar"
        @animationfinish="handleAnimationfinish"
      >
        <block v-for="(months, mIndex) in calendar" :key="mIndex">
          <!-- 一个 swiper-item 表示一个月份的表格 -->
          <swiper-item>
            <block v-for="(weeks, wIndex) in months" :key="wIndex">
              <!-- 占了一行的一星期 -->
              <div class="calendar-week-line">
                <block v-for="(days, dIndex) in weeks" :key="dIndex">
                  <!-- 只占一天的小格子 -->
                  <div class="day-box" @click="handleToTapDay(days)">
                    <!-- 西兰花图标 -->
                    <block v-if="!!activeIcon">
                      <div class="day-wrap">
                        <image class="broccoli-icon" :src="activeIcon"></image>
                      </div>
                    </block>
                    <!-- 显示正常日期 -->
                    <div
                      v-else
                      class="day-wrap"
                      :class="[
                        `day-${days.type}`,
                        {
                          'selected-day':
                            days.type == 'this' &&
                            days.year == selectDay.year &&
                            days.month == selectDay.month &&
                            days.day == selectDay.day,
                        },
                      ]"
                    >
                      <div class="day">{{ days.day }}</div>
                      <div
                        class="day-cn"
                        :style="{ color: days.lunarFestival || days.festival ? '#07b45b' : '' }"
                      >
                        {{
                          days.lunarFestival ||
                          days.festival ||
                          (days.dayCn == '初一' ? days.monthCn : days.dayCn)
                        }}
                      </div>
                    </div>
                  </div>
                </block>
              </div>
            </block>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue';
import { initCalendar } from './sources/calendar';

export type SelectDay = {
  day: number;
  /** 天数中文 */
  dayCn?: string;
  festival?: null;
  lunarFestival?: null;
  /** 月份 */
  month: number;
  /** 月份中文 */
  monthCn?: string;
  /**  */
  type?: 'this';
  year: number;
  yearCn?: string;
};

export interface Props {
  /** 初始化日历数据的范围[月]（默认加载当前时间为中心共5个月） */
  lodingScope?: number;
  /** 标题栏右侧文本 */
  headRightCont?: string;
  /** 显示标题栏操作按钮 */
  showHeadOperate?: boolean;
  /** 被激活日期的图标 */
  activeIcon?: string;
  /** 开、关 日历组件右滑尽头加载新日历(右滑，过去的日历) */
  rightTohAnimEnd?: boolean;
  /** 开、关 日历组件左滑尽头加载新日历 */
  leftTohAnimEnd?: boolean;
  /** 日历背景图 */
  calBackImage?: string;
  /** 点击选中日期 */
  onClick?: (value: SelectDay) => void;
  /** 点击返回按钮 */
  onBack?: () => void;
  /** 点击设置按钮 */
  onSetting?: (value: SelectDay) => void;
}

export interface State {
  /** 标题栏文本 */
  weekLineTxt: string[];
  /** 选中日期信息 */
  selectDay: SelectDay;
  /** 当前年份 */
  currentYear: number;
  /** 当前月份 */
  currentMonth: number;
  /** 日历数据 */
  calendar: any[];
  /** 当前日历 Swiper 索引位 */
  calendarCurrent: number;
}

const {
  lodingScope,
  headRightCont,
  showHeadOperate,
  activeIcon,
  rightTohAnimEnd,
  leftTohAnimEnd,
  calBackImage,
  onBack,
  onSetting,
  onClick,
} = withDefaults(defineProps<Props>(), {
  lodingScope: 5,
  showHeadOperate: true,
  headRightCont: '设置',
});

const data = reactive<State>({
  weekLineTxt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  selectDay: { day: 0, month: 0, year: 0 }, // 当前选中的日期
  currentYear: 0, // 日历标题 -> 显示当前年月份
  currentMonth: 0, // 日历标题 -> 显示当前年月份
  calendar: [], // 日历数据
  calendarCurrent: 0, // 控制当前滑块组件显示的索引，根据月份显示当前月份日历表
});

let lastCurrent = 0; // 记录上一次滑块的索引值 (用来判断本次滑动的方向)

onMounted(() => {
  initCalendarData();
});

/**
 * 初始化日历数据、日历标题
 */
const initCalendarData = () => {
  console.log('initCalendarData');

  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const lodScope = lodingScope || 5; // 加载日历的范围
  const scpHalf = Math.floor(lodScope / 2);
  let arr: any[] = []; // 保存返回的日历数据
  let dates: Date; // 保存格式化后的日期 new Date(2020, 11, 32)  -> 2021/1/1

  // 获取以这个月为中心，共5个月的日历数据
  for (let i = -scpHalf; i < lodScope - scpHalf; i++) {
    dates = new Date(y, m + i, 1);
    arr.push(initCalendar('month', dates)[0]);
  }

  const today = {
    year: y,
    month: m + 1,
    day: new Date().getDate(),
  };

  lastCurrent = scpHalf; // 记录这次的滑块位置
  data.currentYear = y; // 初始标题年份
  data.currentMonth = m + 1; // 初始标题月份
  data.calendar = arr; // 获取当前时间 年日历排版
  data.calendarCurrent = scpHalf; // 初始滑块的位置在中间
  data.selectDay = today;
  console.log('data.calendar: ', data.calendar);
};

/**
 * 滑块索引改变时，更改标题年、月
 * @callback 滑块current发生改变
 */
const handleToChangeCalendar = (e) => {
  const current = e.detail.current;
  const difCent = current - lastCurrent; // 基于上次，本次滑动的 swiper-item 数（向左为负）
  let currentY = data.currentYear; // 当前标题年份(滑动更改前)
  let currentM = data.currentMonth; // 当前标题月份(滑动更改前)

  currentM += difCent; // 根据本次滑动的块数，把月份值做更改

  const dates = new Date(currentY, currentM - 1); // 重新格式化当前日期

  currentY = dates.getFullYear();
  currentM = dates.getMonth() + 1;

  data.currentYear = currentY; // 更改标题中的年份
  data.currentMonth = currentM; // 更改标题中的月份
  lastCurrent = current; // 记录本次滑块的位置
};

/**
 * 滑块动画结束后，(如果是在最前端、最后端无法再滑动) 则在最前、后端添加数据
 * @callback 滑块动画停止事件（在change事件之后触发）
 */
const handleAnimationfinish = (e) => {
  const source = e.detail.source; // 触发类型，是否用户手动触发
  const current = e.detail.current; // 动画结束后的current
  const calendar = data.calendar; // 当前日历数据
  const currentY = data.currentYear; // 当前标题显示的年份
  const currentM = data.currentMonth; // 当前标题显示的月份

  let dates: Date; // 要加载的日历日期
  let arr: any[] = []; // 存放新加载的日历数据

  // 本次由用户主动触发 才往下执行
  if (source != 'touch') return;

  // 给最前端新增一条日历表
  if (current == 0) {
    if (rightTohAnimEnd) return; // 右滑加载新日历关闭状态，不加载新日历

    // 格式化新增日历的时间格式
    // 假设当前2020年12月 new Date(2020, 10) == 2020/11/1
    dates = new Date(currentY, currentM - 2, 1);
    // dates = dates.getFullYear() + '-' +(dates.getMonth() + 1) + '-' + '1';

    // 获取上个月日历数据
    arr = initCalendar('month', dates)[0];

    data.calendar.unshift(arr);
    data.calendarCurrent = 0; // 把滑块索引设置第一位
    data.currentYear = dates.getFullYear();
    data.currentMonth = dates.getMonth() + 1;
    lastCurrent = 0; // 动画结束后，记录本次滑块的位置
  }
  // 给最后端新增一条日历表
  else if (current == calendar.length - 1) {
    if (leftTohAnimEnd) return; // 右滑加载新日历关闭状态，不加载新日历

    // 格式化新增日历的时间格式
    // 假设当前2020年12月 new Date(2020, 12) == 2021/1/1
    dates = new Date(currentY, currentM, 1);
    // dates = dates.getFullYear() + '-' +(dates.getMonth() + 1) + '-' + '1';

    // 获取下个月日历数据
    arr = initCalendar('month', dates)[0];

    data.calendar.push(arr);
    data.calendarCurrent = calendar.length - 1; // 把滑块索引设置最后一位
    data.currentYear = dates.getFullYear();
    data.currentMonth = dates.getMonth() + 1;
    lastCurrent = calendar.length - 1; // 动画结束后，记录本次滑块的位置
  }
  // 没有触发新增日历
  else {
    // 滑动动画结束后的日期
    dates = new Date(currentY, currentM - 1, 1);
  }

  // 动画结束后 选中的日期变更到当月第一天
  data.selectDay.year = dates.getFullYear();
  data.selectDay.month = dates.getMonth() + 1;
  data.selectDay.day = 1;
};

/**
 * 点击日期切换选中效果，或左右翻页
 * @param {*} e
 * @callback 点击日期
 */
const handleToTapDay = (value) => {
  if (value.type !== 'this') {
    return;
  }

  data.selectDay = value;
  onClick?.(value);
};

/**点击左边按钮 */
const handleOnBack = () => {
  onBack?.();
};
/** 点击右边按钮 */
const handelOnSetting = () => {
  const value = data.selectDay;
  onSetting?.(value as SelectDay);
};

const { weekLineTxt, selectDay, currentYear, currentMonth, calendar, calendarCurrent } = toRefs(data);
</script>

<style lang="scss">
.calendar {
  display: flex;
  height: 100%;
  flex-direction: column;
  background: #fff;
  border-bottom: 2rpx solid #efefef;

  .header {
    position: relative;
    margin: 20rpx 0;

    .left,
    .right {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
    }

    .left {
      left: 20rpx;
    }

    .right {
      right: 20rpx;
    }

    .left-icon {
      width: 40rpx;
      height: 40rpx;
    }

    .right-txt {
      font-size: 32rpx;
      font-weight: 500;
      color: #07b45b;
    }

    .title {
      text-align: center;
      font-weight: 500;
      font-size: 36rpx;
    }
  }

  .calendar-swiper {
    padding-bottom: 10rpx;
    height: calc((64rpx + 10rpx) * 6);
  }

  .calendar-case {
    background: 0 / 100% 100%;
  }
  .week-line,
  .calendar-week-line {
    display: flex;
  }

  .calendar-week-line {
    margin-top: 10rpx;
  }

  .week-line .item,
  .calendar-week-line .day-box {
    display: flex;
    width: calc(100vw / 7);
    /* height: calc(100vw / 7); */
    /* align-items: center; */
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
  }

  .week-line {
    border-top: 2rpx solid #efefef;
    border-bottom: 2rpx solid #d8d8d8;
    padding: 10rpx 0;
    margin-bottom: 4rpx;
  }

  .week-line .item {
    font-weight: 500;
    color: #8c8e91;
    font-size: 28rpx;
  }

  .day-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* align-items: center; */
    width: 66rpx;
    height: 64rpx;
  }

  .day-wrap .day,
  .day-wrap .day-cn {
    width: 100%;
    text-align: center;
    line-height: 1;
  }

  /* 上月、下月日历都显示灰色 */
  .day-last .day,
  .day-last .day-cn,
  .day-next .day,
  .day-next .day-cn {
    color: #adafb1 !important;
  }

  .day-wrap .day {
    font-size: 32rpx;
  }

  .day-wrap .day-cn {
    font-size: 20rpx;
    color: #888;
  }

  /* 当天日期的颜色 */
  .day-box .today .day {
    color: #07b45b;
    font-weight: 500;
  }

  .day-box .today .day-cn {
    color: #07b45b;
    font-weight: 500;
  }

  .selected-day {
    position: relative;
  }

  .selected-day::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #07b45b;
  }

  .selected-day .day {
    color: #fff !important;
  }

  .selected-day .day-cn {
    color: #fff !important;
  }

  .day-wrap .broccoli-icon {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
