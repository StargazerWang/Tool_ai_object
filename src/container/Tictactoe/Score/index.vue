<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header/index.vue';
import Chessboard from '@/components/Tictactoe/Chessboard.vue';
import Introduce from '@/components/Introduce.vue';
import guide from "@/utils/guide";
import { pageShow, buttonClick } from '@/utils/report';
import xPic from './../images/x-pic.png';
import oPic from './../images/o-pic.png';

const route = useRoute();
const TOOL_NAME = route.meta.title;

const visible = ref('');
const role = ref('');
const tips = ref('');
const status = ref(false);
const attackList = ref(new Array(9).fill(null).map(() => ({ player: '', score: null })));
const defenseList = ref(new Array(9).fill(null).map(() => ({ player: '', score: null })));

const chessBoardRef = ref(null);
const introduceBoxRef = ref(null);
const guideStep2 = ref(null);
const guideStep3 = ref(null);
const guideStep4 = ref(null);

let isScore = false;

onMounted(() => {
  pageShow({
    pageName: 'tictactoe_score',
    IdNum: 'tictactoe_score',
    textInfo: '井字棋打分工具'
  });
  showGuide();
})

function showGuide() {
  const config = {};
  let noData = true;
  for (let i = 0; i < attackList.value.length; i++) {
    if (attackList.value[i].player) {
      noData = false;
      break;
    }
  }
  if (noData) {
    let chesses = ['x', 'x', null, 'o', null, null, null, 'o', null];
    attackList.value = chesses.map((item) => ({ player: item, score: null }));
    defenseList.value = chesses.map((item) => ({ player: item, score: null }));
    chessBoardRef.value.setChesses(chesses);
    config.doneCb = ()=> {
      chessBoardRef.value.setChesses(new Array(9).fill(null));
      attackList.value = new Array(9).fill(null).map(() => ({ player: '', score: null }));
      defenseList.value = new Array(9).fill(null).map(() => ({ player: '', score: null }));
    }
  }
  const steps = [
    {element: introduceBoxRef?.value?.introduceRef, popover: {title: '第一步', description: `在此查看《${TOOL_NAME}》的使用介绍`}},
    {element: guideStep2.value, popover: {title: '第二步', description: `点击「开始新棋局」开启体验“${TOOL_NAME}”`}},
    {element: guideStep3.value, popover: {title: '第三步', description: '在此对进攻方/防守方，落子打分 '}},
    {element: guideStep4.value, popover: {title: '第四步', description: '打分后，在此点击“确认落子”'}}, 
  ].filter(item => item.element); 
  if (steps.length > 0) guide(steps, config);
}

function generateXOArray(size = 9, xCount = 2, oCount = 2) {
  const arr = Array(size).fill(null);
  const indexes = [...Array(size).keys()]; // [0,1,2,3,4,5,6,7,8]
  // 打乱索引顺序
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  // 前 xCount 个放 x
  for (let i = 0; i < xCount; i++) {
    arr[indexes[i]] = 'x';
  }
  // 再放 o
  for (let i = xCount; i < xCount + oCount; i++) {
    arr[indexes[i]] = 'o';
  }
  return arr;
}

function chessChage(index, player, arr) {
  role.value = index === -1 ? player : player === 'x' ? 'o' : 'x';
  tips.value = '当前执手方:'
  
  attackList.value = arr.map((item) => ({ player: item, score: null }));
  defenseList.value = arr.map((item) => ({ player: item, score: null }));
}

function onOver(data) {
  status.value = false;
  if (!data.winner) {
    tips.value = '平局';
    role.value = '';
    return;
  }
  tips.value = '获胜方：';
  role.value = data.winner;
}

function changeState() {
  buttonClick({
    pageName: 'tictactoe_score',
    name: 'tictactoe_score_newChess',
    IdNum: 'tictactoe_score_newChess',
    textInfo: '井字棋打分工具--点击新棋局按钮'
  })
  status.value = true;
  let arr = generateXOArray();
  chessBoardRef.value.reset(arr);
}

function showScoreMod(index, type) {
  if (!status.value) return;
  if (type === 'attack' && !attackList.value[index].player) {
    visible.value = 'attack' + index;
  } else if (type === 'defense' && !defenseList.value[index].player) {
    visible.value = 'defense' + index;
  }
}

function selectScore(index, score, type, e) {
  e.stopPropagation();
  if (type === 'attack' && !attackList.value[index].player) {
    attackList.value[index].score = score;
    isScore = true;
  } else if (type === 'defense' && !defenseList.value[index].player) {
    defenseList.value[index].score = score;
    isScore = true;
  }
  visible.value = '';
}

function selectChess() {
  if (!isScore) {
    alert('请先打分再确认落子！')
    return;
  }
  isScore = false;
  let arr = []
  for (let i = 0; i < attackList.value.length; i++) {
    if (attackList.value[i].player) {
       arr.push(-999);
      continue
    }
    arr.push(attackList.value[i]?.score + defenseList.value[i]?.score)
  }
  let maxScore = Math.max(...arr);
  let index = arr.indexOf(maxScore);
  console.log(index, arr);
  
  buttonClick({
    pageName: 'tictactoe_score',
    name: 'tictactoe_score_confirmChess',
    IdNum: 'tictactoe_score_confirmChess',
    textInfo: '井字棋打分工具--点击确认落子按钮'
  })
  chessBoardRef.value.select(index);
}

</script>

<template>
  <Header>
    <RouterLink to="/tictactoe" class="tool-name">{{ TOOL_NAME }}</RouterLink>
  </Header>
  <div class="tictactoe-container">
    <div class="content">
      <div class="chess-content" >
        <div class="chess-score-box">
          <div class="chess-top">
            <h4>落子赋分</h4>
            <div class="tips"></div>
          </div>
          <div ref="guideStep3">
            <div class="chess-score">
              <h5>进攻方视角打分</h5>
              <div class="score-board">
                <div
                  v-for="(item, index) in attackList"
                  :class="!status || item.player || item.score !== null || visible === ('attack' + index) ? 'item disabled' : 'item'"
                  @click="showScoreMod(index, 'attack')"
                  :style="{
                    backgroundImage: item.player ? `url(${item.player === 'x' ? xPic : oPic})` : '',
                    backgroundColor: item.score || item.score == 0 ? `var(--x)` : '#f5f5f5'
                  }"
                  :key="index"
                >
                  {{ item.score !== null ? item.score : '' }}
                  <div class="score-mask" v-show="visible === ('attack' + index)">
                    <div class="score">
                      <h5>选择分值</h5>
                      <span @click="selectScore(index, 100, 'attack', $event)">100分</span>
                      <span @click="selectScore(index, 10, 'attack', $event)">10分</span>
                      <span @click="selectScore(index, 0, 'attack', $event)">0分</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chess-score">
              <h5>防守方视角打分</h5>
              <div class="score-board">
                <div
                  v-for="(item, index) in defenseList"
                  :class="!status || item.player || item.score !== null || visible === ('defense' + index) ? 'item disabled' : 'item'"
                  @click="showScoreMod(index, 'defense')"
                  :style="{
                    backgroundImage: item.player ? `url(${item.player === 'x' ? xPic : oPic})` : '',
                    backgroundColor: item.score || item.score == 0 ? `var(--x)` : '#f5f5f5'
                  }"
                  :key="index"
                >
                  {{ item.score !== null ? item.score : '' }}
                  <div class="score-mask" v-show="visible === ('defense' + index)">
                    <div class="score">
                      <h5>选择分值</h5>
                      <span @click="selectScore(index, 0, 'defense', $event)">0分</span>
                      <span @click="selectScore(index, -50, 'defense', $event)">-50分</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="confirm-btn" @click="selectChess" :disabled="!status" ref="guideStep4">确认落子</button>
        </div>
        <div class="chess-board-box">
          <div class="chess-top">
            <h4>AI决策</h4>
            <div class="tips">
              <span>{{ tips }}</span>
              <i v-if="role" :class="role"></i>
            </div>
          </div>
          <div class="chess-board-info">
            <Chessboard
              ref="chessBoardRef"
              :disabled="true"
              :onChage="chessChage"
              :onOver="onOver"
              :level="'hard'"
              :mode="'pve'"
            />
          </div>
        </div>
      </div>
      <div class="bottom">
        <button class="start-btn" @click="changeState" :disabled="status"ref="guideStep2 ">开始新棋局</button>
      </div>
    </div>
    <Introduce ref="introduceBoxRef" :path="'/tool-introduce/tictactoe-score/score.md'" />
  </div>
</template>

<style src="./index.css" scoped></style>