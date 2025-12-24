<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header/index.vue';
import Chessboard from '@/components/Tictactoe/Chessboard.vue';
import Introduce from '@/components/Introduce.vue';
import guide from "@/utils/guide";
import { buildUrl } from '@/utils/api';
import { pageShow, buttonClick } from '@/utils/report';

const route = useRoute();
const TOOL_NAME = route.meta.title;

const chessBoardBoxRef = ref(null);
const introduceBoxRef = ref(null);
const tips = ref('');
const role = ref(''); // 当前之手方
const status = ref(false)
const chessRecord = ref([]);
const animation = ref(false);
const unfold = ref(false);

const guideStep2 = ref(null);

onMounted(() => {
  pageShow({
    pageName: 'tictactoe_play',
    IdNum: 'tictactoe_play',
    textInfo: '井字棋下棋工具'
  });
  unfold.value = true;
  setTimeout(() =>{showGuide()}, 100);
})

const machineCode = computed(() => {
  let arr = chessRecord.value.filter(item => item.player);
  arr = arr.sort((a, b) => a.step - b.step);
  return arr
})

function showGuide() {
  const config = {};
  if (chessRecord.value.length <= 0) {
    let chesses = new Array(9).fill(null);
    const guideChess = [
      {pos: 1, step: 2, player: 'o', active: false},
      {pos: 2, step: null, player: '', active: false },
      {pos: 3, step: 3, player: 'x', active: false},
      {pos: 4, step: 4, player: 'o', active: true},
      {pos: 5, step: 1, player: 'x', active: false},
      {pos: 6, step: null, player: '', active: false},
      {pos: 7, step: null, player: '', active: false},
      {pos: 8, step: null, player: '', active: false},
      {pos: 9, step: null, player: '', active: false}
    ];
    chessRecord.value = guideChess;
    for (let i = 0; i < guideChess.length; i++) {
      chesses[i] = guideChess[i].player;
    }
    tips.value = '当前执手方:';
    role.value = 'x';
    chessBoardBoxRef.value.setChesses(chesses);
    config.doneCb = ()=> {
      chessBoardBoxRef?.value?.setChesses(new Array(9).fill(null));
      chessRecord.value = [];
      tips.value = '';
      role.value = '';
      unfold.value = false;
      setTimeout(() => {
        if (animation) animation.value = true;
      }, 100);
    }
  }
  const steps = [
    {element: introduceBoxRef?.value?.introduceRef, popover: {title: '第一步', description: `在此查看《${TOOL_NAME}》的使用介绍 `}},
    {element: guideStep2?.value , popover: {title: '第二步', description: `点击「开始新棋局」开启体验“${TOOL_NAME}”`}},
  ].filter(item => item.element);
  if (steps.length > 0) guide(steps, config);
}

function chessChage(index, player, arr) {
  tips.value = '当前执手方:';
  if (index === -1) {
    chessRecord.value = new Array(9).fill(null).map((item, i) => ({ pos: i + 1, step: null, player: '' }));
    role.value = player;
    return;
  }
  
  role.value = player === 'x' ? 'o' : 'x';
  if (chessRecord.value[index].player || chessRecord.value[index].step) return;
  chessRecord.value = chessRecord.value.map(item => {
    item.active = false;
    return item;
  })
  const num = chessRecord.value?.filter(item => item.player)?.length;
  chessRecord.value[index].step = num + 1;
  chessRecord.value[index].player = player;
  chessRecord.value[index].active = true;
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

function reset() {
  buttonClick({
    pageName: 'tictactoe_play',
    name: 'tictactoe_play_startChess',
    IdNum: 'tictactoe_play_startChess',
    textInfo: '井字棋下棋工具--点击开始对局按钮'
  })
  status.value = true;
  unfold.value = true;
  chessBoardBoxRef.value.reset();
}

function downloadFn() {
  buttonClick({
    pageName: 'tictactoe_play',
    name: 'tictactoe_play_downloadChessboardFiles',
    IdNum: 'tictactoe_play_downloadChessboardFiles',
    textInfo: '井字棋下棋工具--点击下载棋盘文件按钮'
  });
  try {
    const link = document.createElement('a');
    link.href = buildUrl(`/assets/images/chessboard.png`);
    link.download = `棋盘.png`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
    }, 100);
  } catch (error) {
    console.error('下载失败:', error);
  }
}


/* function saveData(data) {
  try {
    const { chesses, winner, resultTips, mode } = data;
    let dataList = localStorage.getItem('tictactoe-data') || '[]';
    let arr = JSON.parse(dataList);
    const obj = {
      id: String(Date.now()),
      chesses: chesses,
      winner: winner,
      resultTips: resultTips,
      mode: mode,
      chessRecord: chessRecord.value,
      timestamp: Date.now()
    };
    arr = arr.splice(0, 9)
    arr.unshift(obj);
    const dataStr = JSON.stringify(arr);
    localStorage.setItem('tictactoe-data', dataStr);
  } catch (e) {
    console.error('保存游戏数据失败', e);
  }
} */
</script>

<template>
  <Header>
    <RouterLink to="/tictactoe" class="tool-name">{{ TOOL_NAME }}</RouterLink>
  </Header>
  <div class="tictactoe-container">
    <div class="content">
      <div class="chess-content" :class="unfold ? 'unfold' : 'fold'" :style="{ transition: animation ? '' : 'none'}">
        <div class="chess-board-box">
          <div class="chess-top">
            <h4>在此模拟对局</h4>
            <div class="tips">
              <span>{{ tips }}</span>
              <i v-if="role" :class="role"></i>
            </div>
          </div>
          <div class="chess-board-info">
            <Chessboard ref="chessBoardBoxRef" :onChage="chessChage" :onOver="onOver" />
          </div>
        </div> 
        <div class="empty-box"></div>
        <div class="arrow"></div>
        <div class="empty-box"></div>
        <div class="chess-record-box">
          <div class="chess-top">
            <h4>在此观察棋谱 </h4>
            <div class="tips"></div>
          </div>
          <ul class="chess-record">
            <li v-for="item in chessRecord" :key="item.pos" :style="{border: item.active ? `3px solid var(--${item.player})` : ''}">
              <span class="num">{{ item.pos }}</span>
              <span class="txt" :style="{color: `var(--${item.player})`}">{{ item.step ? (`第${item.step}步`) : ''}}</span>
            </li>
          </ul>
          <div class="machine-code">
            <h4>机器编码</h4>
            <ul>
              <li v-for="(item, index) in machineCode" :key="index" :style="{color: `var(--${item.player})`, borderColor: item.active ? `var(--${item.player})` : '#F6F6FC'}">{{ item.pos || '' }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom">
        <button class="start-btn" @click="reset" :disabled="status" ref="guideStep2">开始新棋局</button>
        <button class="download-btn" @click="downloadFn"><i></i>下载棋盘文件</button>
      </div>
    </div>
    <Introduce ref="introduceBoxRef" :path="'/tool-introduce/tictactoe-play/play.md'" />
  </div>
</template>

<style src="./index.css" scoped></style>