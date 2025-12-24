<script setup>
import { ref, onMounted } from 'vue';
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];


const props = defineProps([
  'disabled',
  'onChage',
  'mode',
  'level',
  'onOver',
  'player',
  'chesses',
]);

const chessBoardRef = ref(null);
const chesses = ref(new Array(9).fill(null));
const mask = ref(false);
const status = ref(false);     // 棋局状态
const lastChessIndex = ref(null)

let player = 'x';       // 玩家选择的符号
let role = 'x';         // 当前执手方
let mode = 'pvp'; // 'pve' | 'pvp'
let level = 'hard';  // 难度

onMounted(()=> {
  if (props.level) level = props.level;
  if (props.mode) mode = props.mode;
  if (props.player) player = props.player;
  if (props.chesses) chesses.value = props.chesses;
  if (props.disabled) mask.value = true;
})

// ------------------- 基础工具 -------------------
function isFull(chesses) { return chesses.every(Boolean); }

function checkWinner(chesses) {
  for (const [a, b1, c] of WIN_LINES) {
    if (chesses[a] && chesses[a] === chesses[b1] && chesses[a] === chesses[c]) return chesses[a];
  }
  return null;
}

function makeMove(index, player) {
  if (chesses.value[index] || !status.value) return false;
  chesses.value[index] = player;
  lastChessIndex.value = index;
  props?.onChage(index, player, chesses.value);
  return true;
}

// ------------------- Minimax 算法 -------------------
function minimax(chesses, isMaximizing, playerRoot) {
  const winner = checkWinner(chesses);
  if (winner === playerRoot) return 10;
  if (winner && winner !== playerRoot) return -10;
  if (isFull(chesses)) return 0;

  const currentPlayer = isMaximizing ? playerRoot : (playerRoot === 'x' ? 'o' : 'x');
  let best = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 9; i++) {
    if (!chesses[i]) {
      chesses[i] = currentPlayer;
      const score = minimax(chesses, !isMaximizing, playerRoot);
      chesses[i] = null;
      if (isMaximizing) best = Math.max(best, score);
      else best = Math.min(best, score);
    }
  }
  return best;
}

function bestMove(boardState, player) {
  if (boardState.every(v => !v) && !boardState[4]) return 4;
  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < 9; i++) {
    if (!boardState[i]) {
      boardState[i] = player;
      const score = minimax(boardState, false, player);
      boardState[i] = null;
      if (score > bestScore) { bestScore = score; move = i; }
    }
  }
  if (move === null) for (let i = 0; i < 9; i++) if (!boardState[i]) return i;
  return move;
}

// ------------------- AI 落子逻辑 -------------------
function aiSelect() {
  setTimeout(() => {
    let aiMove = null;
    const emptyCells = chesses.value
      .map((v, i) => (v ? null : i))
      .filter(i => i !== null);
    
    if (level === 'easy') {
      // 🧸 教笨：完全随机
      aiMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (level === 'normal') {
      // ⚖️ 一般：50% 几率用 minimax，50% 随机
      if (Math.random() < 0.5) {
        aiMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      } else {
        aiMove = bestMove(chesses.value, role);
      }
    } else {
      // 🧠 聪明：完全使用 minimax
      aiMove = bestMove(chesses.value, role);
    }

    makeMove(aiMove, role);
    const w = checkWinner(chesses.value);
    if (w) {
      status.value = false;
      props?.onOver({ chesses: chesses.value, winner: w, mode: mode });
      return;
    } else if (isFull(chesses.value)) {
      status.value = false;
      props?.onOver({ chesses: chesses.value, winner: '', mode: mode });
      return;
    }
    role = role === 'x' ? 'o' : 'x';
  }, 180);
}

// ------------------- 玩家操作 -------------------
function select(index) {
  if (!status.value || chesses.value[index]) return;
  
  makeMove(index, role);
  let w = checkWinner(chesses.value);
  if (w) {
    status.value = false;
    props?.onOver({ chesses: chesses.value, winner: w, mode: mode });
    return;
  } else if (isFull(chesses.value)) {
    status.value = false;
    props?.onOver({ chesses: chesses.value, winner: '', mode: mode });
    return;
  }
  role = role === 'x' ? 'o' : 'x';
  if (mode === 'pvp') return;
  aiSelect()
}

function setRole(val) {
  player = val
}

function setLevel(val) {
  level = val
}

function setChesses(val) {
  chesses.value = val;
}

function reset(data) {
  chesses.value = data ? data : new Array(9).fill(null);
  role = player;
  status.value = true;
  lastChessIndex.value = null;
  props?.onChage(-1, player, chesses.value);
}

// 用 defineExpose 暴露函数，以便父组件调用
defineExpose({
  select,
  aiSelect,
  setChesses,
  reset,
  setRole,
  setLevel,
  chessBoardRef
})

</script>

<template>
  <div class="chessboard" ref="chessBoardRef">
    <span
      v-for="(item, index) in chesses"
      @click="select(index)"
      :class="(status ? (item ? 'disabled': '') : 'disabled') + ' chess-' + item"
      :style="{
        borderColor: item && lastChessIndex === index ? `var(--${item})` : 'rgba(77, 57, 182, 0.1)',
        borderWidth: item && lastChessIndex === index ? `4px` : '1px'
      }"
      :key="index"
    ></span>
    <div class="mask" v-show="mask"></div>
  </div>
</template>

<style scoped>
.chessboard {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
  position: relative;
}
.chessboard span {
  display: block;
  border: 1px solid rgba(77, 57, 182, 0.1);
  border-radius: 12px;
  background: #FFFFFF;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 68% 68%;
}
.chessboard span.chess-x {
  background-image: url(./images/x-pic.png);
}
.chessboard span.chess-o {
  background-image: url(./images/o-pic.png);
}
.chessboard span.disabled {
  cursor: default;
}
.chessboard span:not(.disabled):hover {
  background-color: #f6f6f6;
}

.mask {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  left: 0;
  top: 0;
}

</style>