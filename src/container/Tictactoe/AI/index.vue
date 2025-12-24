<script setup>
import { ref, onMounted, provide } from 'vue';
import { useRoute/* , useRouter */ } from 'vue-router';
import Header from '@/components/Header/index.vue';
import Introduce from '@/components/Introduce.vue';
import Create from './Create.vue';
import Train from './Train.vue';
import Versus from './Versus.vue';
import { pageShow } from '@/utils/report';

const route = useRoute();
// const router = useRouter();
const TOOL_NAME = route.meta.title;

const introduceBoxRef = ref(null);

let visible = ref(1);
let level = ref('easy');
let state = ref(0)
let count = ref(0);

const introduceArr = [
  '/tool-introduce/tictactoe-ai/create.md',
  '/tool-introduce/tictactoe-ai/train.md',
  '/tool-introduce/tictactoe-ai/versus.md'
]
let introducePath = ref(introduceArr[0]);

onMounted(() => {
  pageShow({
    pageName: 'tictactoe_ai',
    IdNum: 'tictactoe_ai',
    textInfo: '井字棋AI工具'
  });
  // getData();
  /* const { steps } = route.query;
  if (steps && !isNaN(Number(steps))) {
    changeType(Number(steps))
  } */
})


function changeType(steps) {
  visible.value = steps;
  introducePath.value = introduceArr[steps - 1]
  // router.push({ path: '/tictactoe/ai', query: { steps } })
}

function changeState(val) {
  state.value = val;
}

function changeLevel(type) {
  level.value = type;
  state.value = 0;
}

function changeCount(val) {
  count.value = val;
}


// 提供给子组件
provide('introduceBoxRef', introduceBoxRef);

</script>

<template>
  <Header>
    <RouterLink to="/tictactoe" class="tool-name">{{ TOOL_NAME }}</RouterLink>
  </Header>
  <div class="tictactoe-container">
    <div class="content">
      <ul class="nav">
        <li class="steps" @click="changeType(1)">
          <span class="txt" :style="{color: visible >= 1 ? '#4D39B6' : '#757575'}">下载数据集</span>
          <span
            class="num"
            :style="{
              color: visible === 1 ? '#FFFFFF' : visible > 1 ? '#4D39B6' : '#757575',
              backgroundColor: visible === 1 ? '#4D39B6' : visible > 1 ? '#FFFFFF' : 'transparent'
            }"
          >1</span>
        </li>
        <li class="line"></li>
        <li class="steps" @click="changeType(2)">
          <span class="txt" :style="{color: visible >= 2 ? '#4D39B6' : '#757575'}">模型训练</span>
          <span
            class="num"
            :style="{
              color: visible === 2 ? '#FFFFFF' : visible > 2 ? '#4D39B6' : '#757575',
              backgroundColor: visible === 2 ? '#4D39B6' : visible > 2 ? '#FFFFFF' : 'transparent'
            }"
          >2</span>
        </li>
        <li class="line"></li>
        <li class="steps" @click="changeType(3)">
          <span class="txt" :style="{color: visible >= 3 ? '#4D39B6' : '#757575'}">与AI对战</span>
          <span
            class="num"
            :style="{
              color: visible === 3 ? '#FFFFFF' : visible > 3 ? '#4D39B6' : '#757575',
              backgroundColor: visible === 3 ? '#4D39B6' : visible > 3 ? '#FFFFFF' : 'transparent'
            }"
          >3</span>
        </li>
      </ul>
      <Create
        :changeType="changeType"
        :changeState="changeState"
        :visible="visible"
        :state="state"
        :changeLevel="changeLevel"
        :level="level"
        :changeCount="changeCount"
        :count="count"
        v-show="visible === 1"
      />
      <Train
        :changeType="changeType"
        :changeState="changeState"
        :visible="visible"
        :state="state"
        :level="level"
        :count="count"
        v-show="visible === 2"
      />
      <Versus
        :changeState="changeState"
        :visible="visible"
        :state="state"
        :level="level"
        v-show="visible === 3"
      />
    </div>
    <Introduce ref="introduceBoxRef" :path="introducePath" />
</div>
</template>

<style src="./index.css" scoped></style>