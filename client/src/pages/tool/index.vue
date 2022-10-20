<template>
  <view class="tool-page">
    <view class="computer-wrapper">
      <input
        class="symbol-input"
        type="text"
        placeholder="输入特殊符号（多符号个以空格分割：- _ +）"
        @input="handleSymbolInput"
      />
      <view class="tips">根据输入的'特殊符号'进行拆分并统计出现最多次数的数字</view>
      <textarea
        class="computer-textarea"
        placeholder="按格式输入：[数字][符号][数字]"
        @input="handleInput"
      ></textarea>
      <view class="computer-result">
        <view class="result-label">结果：</view>
        <view class="" v-for="item in ansList" :key="item">
          数字 <text class="number">{{ item.number }}</text> 出现次数：<text class="count">{{
            item.count
          }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { reactive, toRefs } from 'vue';

interface Props {
  type: string;
}

const props = defineProps<Props>();
const { type } = props;

const data = reactive({
  symbolStr: '',
  nums: '',
  ansList: [],
});

onLoad(() => {
  if (type === 'statistics') {
    wx.setNavigationBarTitle({
      title: '累计最多数',
    });
  }
});

const handleSymbolInput = (e) => {
  let regStr = '';
  let { value } = e.detail;

  value = value.trim().replaceAll(/\s+/g, ' ');
  for (let i = 0; i < value.length; i++) {
    const s = value[i];
    if (/\s+/.test(s)) {
      regStr += '|';
    } else if (/([a-z|A-Z])+/.test(s)) {
      regStr += s;
    } else {
      regStr += `\\${s}`;
    }
  }
  data.symbolStr = regStr;

  if (data.nums) {
    computedResult();
  }
};

const handleInput = (e) => {
  const { value } = e.detail;

  data.nums = value.trim();

  if (symbolStr) {
    computedResult();
  }
};

const computedResult = () => {
  const max = {},
    ansList = [];

  const reg = new RegExp(data.symbolStr + '|\\s', 'g');
  // console.log('reg: ', reg)
  data.nums.split(reg).forEach((val) => {
    if (max[val]) {
      max[val] += 1;
    } else {
      max[val] = 1;
    }
  });
  Object.getOwnPropertyNames(max).forEach((key) => {
    if (key) {
      ansList.push({
        number: key,
        count: max[key],
      });
    }
  });
  ansList.sort((x, y) => y.count - x.count);

  data.ansList = ansList;
};

const { symbolStr, nums, ansList } = toRefs(data);
</script>

<style lang="scss">
.tool-page {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.computer-wrapper {
  display: flex;
  padding: 50rpx 40rpx;
  justify-content: center;
  flex-direction: column;
}

.computer-wrapper .tips {
  font-size: 26rpx;
  color: #acacac;
  margin-bottom: 10rpx;
}

.computer-wrapper .computer-textarea {
  width: 100%;
  height: 400rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-sizing: border-box;
  border: 2rpx solid #eee;
}

.computer-wrapper .computer-result {
  width: 100%;
  margin-top: 20rpx;
}

.computer-result .result-label {
  margin-bottom: 20rpx;
}

.number {
  color: rgb(20, 149, 235);
}

.count {
  color: brown;
}

.symbol-input {
  width: 100%;
  height: 70rpx;
  box-sizing: border-box;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #cdcdcd;
  border-radius: 99999px;
}
</style>
