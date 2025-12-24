<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, inject } from 'vue';
import * as echarts from 'echarts';
import guide from "@/utils/guide";
import { buttonClick } from '@/utils/report';

const props = defineProps([
  'changeType',
  'count',
  'changeState',
  'visible',
  'state',
  'level'
]);

// 从父组件获取 ref
const introduceBoxRef = inject('introduceBoxRef');

const chartRef = ref(null);
const training = ref(false);
const maxEpoch = ref(100);
const trained = ref(false);

const guideStep1 = ref(null);
const guideStep3 = ref(null);
const guideStep4 = ref(null);
const guideStep5 = ref(null);


let timer = null;
let chart = null;
let chartData = [];
let maxChartY = 2;

onMounted(() => {
  if (!chart) initChart()
})
onBeforeUnmount(() => {
  chart?.dispose();
})

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

watch(() => props.visible, (val) => {
  setTimeout(() =>{
    if (val === 2) showGuide();
  }, 100)
});


function showGuide() {
  const config = {};
  const steps = [
    {element: guideStep1.value, popover: {title: '第一步', description: '模型训练工具'}},
    {element: introduceBoxRef?.value?.introduceRef, popover: {title: '第二步', description: '工具介绍'}},
    {element: guideStep3.value, popover: {title: '第三步', description: '训练参数'}},
    {element: guideStep4.value, popover: {title: '第四步', description: '开始训练'}},
    {element: guideStep5.value, popover: {title: '第五步', description: '训练状态'}},
  ].filter(item => item.element);
  if (steps.length > 0) guide(steps, config);
}

function initChart() {
  if (!chart) chart = echarts.init(chartRef.value);
  chartData = [{name: 'acc', data: []}, {name: 'loss', data: []}];
  chart.setOption(getChartOptions(chartData));
}

function updateChart(epoch, data) {
  let series = []
  for (let i = 0; i < chartData.length; i++) {
    let key = chartData[i].name;
    let num = data[key];
    if (num > maxChartY) maxChartY = Math.floor(num) + 1;
    chartData[i].data.push({ value: [epoch, num] });
    series.push({
      name: chartData[i].name,
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: chartData[i].data
    })
  }
  chart.setOption({
    yAxis: {
      max: maxChartY
    },
    xAxis: { max: epoch },
    series: series
  })
}

function trainFn() {
  if (training.value) return;
  if (maxEpoch.value < 20 || maxEpoch.value > 400) {
    alert('训练轮数不能小于20或大于400！');
    return;
  }
  
  buttonClick({
    pageName: 'tictactoe_ai',
    name: 'tictactoe_ai_trainModel',
    IdNum: 'tictactoe_ai_trainModel',
    textInfo: '井字棋AI工具--点击训练模型按钮'
  })
  trained.value = false;
  training.value = true;
  initChart(); // 重置图表
  let epoch = 1;
  let num = Math.floor(maxEpoch.value * 0.2);
  if (num <= 1) num = 1;
  let levelNum = props.level === 'easy' ? 0.2 : props.level === 'normal' ? 0.1 : 0;
  // 先清除之前的定时器
  timer && clearInterval(timer);

  timer = setInterval(() => {
    if (epoch > maxEpoch.value) {
      clearInterval(timer);
      training.value = false;
      trained.value = true;
      props.changeState(2);
      return;
    }

    // ===== ACC: 指数增长，开始快，后期慢 =====
    let acc;
    if (epoch <= num) {
      const t = epoch / num; // 0~1
      acc = 1 - Math.exp(-3 * t); // 0 → 1，前期增长快，后期慢
      acc += getRandom(-0.02 - levelNum, 0.02 - levelNum); // 小扰动
    } else {
      acc = getRandom(0.95 - levelNum, 1.0 - levelNum); // 收敛波动
    }
    acc = Math.min(Math.max(acc, 0), 1); // 限制范围 [0,1]

    // ===== LOSS: 指数衰减，开始快，后期慢 =====
    let loss;
    if (epoch <= num) {
      const t = epoch / num;
      loss = 4 * Math.exp(-3 * t); // 4 → 0
      loss += getRandom(-0.05 + levelNum, 0.05 + levelNum);
    } else {
      loss = getRandom(0.05 + levelNum, 0.1 + levelNum);
    }
    loss = Math.max(loss, 0);

    // ===== 更新图表 =====
    updateChart(epoch, { acc, loss });
    epoch++;
  }, 200);
}




function getChartOptions(arr) {
  let series = [];
  for (let i = 0; i < arr.length; i++) {
    let obj = {
      name: arr[i].name,
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: []
    };
    if (arr[i].color) obj.color = arr[i].color;
    series.push(obj);
  }
  const options = {
    color: ['#F87D57', '#4D39B6'],
    tooltip: {
      trigger: 'axis', formatter: function (params) {
        let rounds = params[0].value[0];
        let str = '<b>第' + rounds + '轮</b><br />';
        for (let i = 0; i < params.length; i++) {
          str += params[i].seriesName + '：<span style="color: #f66;">' + params[i].value[1] + '</span><br />'
        }
        return str;
      },
    },
    /* legend: {
      data: arr.map(item => item.name),
      top: '20px',             // 上边距
      left: 'center',          // 水平居中
    }, */
    grid: {
      left: '10%',
      right: '14%',
      bottom: '10%'
    },
    xAxis: {
      name: '轮数',
      type: 'value',
      splitLine: {
        show: false
      },
      min: 1,
      // interval: 1, // 间隔
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      },
      min: 0
    },
    series,
    animation: false
  }
  return options;
}

function getRandom(min, max) {
  if (min > max) [min, max] = [max, min]; // 自动纠正顺序
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(5)); // 自动去掉多余的 0
}

</script>

<template>
  <div class="train-container">
    <div class="train-content" ref="guideStep1">
      <div class="info-box">
        <div ref="guideStep3">
          <h5>数据集数量</h5>
          <p>{{ state < 1 ? '---' : (count || 0) }}</p>
          <h5>数据集质量</h5>
          <p>{{ state < 1 ? '---' : level === 'easy' ? '较差' : level === 'normal' ? '一般' : '优秀' }}</p>
          <h5>训练轮数</h5>
          <input class="train-input" type="text" v-model="maxEpoch" :disabled="state < 1 || training" />
        </div>
        <button class="train-btn" @click="trainFn" :disabled="state < 1 || training" :title="state < 1 ? '请先“生成数据集”才能训练模型' : ''" ref="guideStep4">训练模型</button>
      </div>
      <div class="chart-content" ref="guideStep5">
        <div class="chart-top">
          <h4>模型训练</h4>
          <ul class="series-title">
            <li><i></i>ACC</li>
            <li><i></i>LOSS</li>
          </ul>
        </div>
        <div class="chart-box">
          <div class="chart" ref="chartRef"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button class="next-btn" @click="changeType(3)" :disabled="state < 1 || training || !trained" :title="state < 1 ? '请先“生成数据集”才能训练模型' : ''">与训练后的AI进行对战<i></i></button>
    </div>
  </div>
</template>

<style scoped>
.train-content {
  width: 1100px;
  height: 600px;
  display: flex;
  border-radius: 18px;
  box-shadow:  0px 12px 48px 0px rgba(13,13,13,0.14);
  background: #FFFFFF;
  margin: 0 auto;
  overflow: hidden;
}


.info-box {
  width: 27.28%;
  height: 100%;
  padding: 24px;
}
.info-box h5 {
  font-size: 18px;
  color: #333;
  font-weight: 400;
}
.info-box p {
  font-size: 18px;
  color: #757575;
  font-weight: 400;
  margin-bottom: 10px;
}
.info-box input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background: #FFFFFF;
  margin-top: 8px;
  margin-bottom: 24px;
}

.train-btn {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #fff;
  border-radius: 12px;
  background: #4D39B6;
  border: none;
  cursor: pointer;
  margin-top: 24px;
}
.train-btn[disabled] {
  background-color: rgba(77, 57, 182, 0.5);
  cursor: no-drop;
}
.train-btn:not([disabled]):hover {
  box-shadow:  0px 8px 16px 0px rgba(77, 57, 182, 0.2);
}



.chart-content {
  width: 72.72%;
  height: 100%;
  padding: 24px;
}
.chart-top {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.chart-top h4 {
  font-size: 24px;
  color: #333;
  font-weight: 400;
}
.series-title {
  width: max-content;
  height: 100%;
  display: flex;
  align-items: center;
}
.series-title li {
  width: max-content;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #F87D57;
  margin-left: 24px;
}
.series-title li i {
  width: 24px;
  height: 24px;
  display: block;
  background: url(./../images/chart-serie-icon1.png) no-repeat center;
  background-size: 100%;
  margin-right: 6px;
}
.series-title li:last-child {
  color: #4D39B6;
}
.series-title li:last-child i {
  background: url(./../images/chart-serie-icon2.png) no-repeat center;
}

.chart-box {
  width: 100%;
  height: calc(100% - 46px);
  display: flex;
  align-items: flex-end;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.02);
}
.chart {
  width: 648px;
  height: 446px;
  /* border: 1px solid #757575; */
}


.bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}
.next-btn {
  width: 480px;
  height: 74px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  border-radius: 12px;
  background: #4D39B6;
  border: none;
  cursor: pointer;
}
.next-btn[disabled] {
  background-color: rgba(77, 57, 182, 0.5);
  cursor: no-drop;
}
.next-btn:not([disabled]):hover {
  box-shadow:  0px 8px 16px 0px rgba(77, 57, 182, 0.2);
}

.next-btn i {
  width: 28px;
  height: 28px;
  display: block;
  margin-left: 14px;
  background: url(./../images/next-icon.png) no-repeat center;
}
</style>