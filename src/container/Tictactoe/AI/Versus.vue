<script setup>
import { ref, watch, inject } from 'vue';
import Chessboard from '@/components/Tictactoe/Chessboard.vue';
import guide from "@/utils/guide";
import { buttonClick } from '@/utils/report';

const props = defineProps([
  'changeState',
  'visible',
  'state',
  'level', // AI 难度 level（easy / normal / hard）
]);

// 从父组件获取 ref
const introduceBoxRef = inject('introduceBoxRef');

const chessBoardBoxRef = ref(null);
const tips = ref('');
const role = ref(''); // 当前之手方
const player = ref('x')
const status = ref(false)
const chessRecord = ref([]);
const visible = ref(false)

const guideStep1 = ref(null);
const guideStep3 = ref(null);
const guideStep4 = ref(null);
const guideStep5 = ref(null);
const guideStep6 = ref(null);

watch(() => props.visible, (val) => {
  setTimeout(() =>{
    if (val === 3) showGuide();
  }, 100)
});

function showGuide() {
  const config = {};
  if (chessRecord.value.length <= 0) {
    let chesses = new Array(9).fill(null);
    const guideChess = [{pos: 5, player: 'x'}, {pos: 1, player: 'o'}, {pos: 3, player: 'x'}, {pos: 4, player: 'o'}];
    chessRecord.value = guideChess.concat(new Array(5).fill(null).map(() => ({ pos: null, player: '' })));
    for (let i = 0; i < guideChess.length; i++) {
      chesses[guideChess[i].pos - 1] = guideChess[i].player;
    }
    tips.value = '当前执手方:';
    role.value = 'x';
    chessBoardBoxRef.value.setChesses(chesses);
    config.doneCb = ()=> {
      chessBoardBoxRef?.value?.setChesses(new Array(9).fill(null));
      chessRecord.value = [];
      tips.value = '';
      role.value = '';
    }
  }
  const steps = [
    {element: guideStep1.value, popover: {title: '第一步', description: '这是一个井字棋与AI对战游戏工具'}},
    {element: introduceBoxRef?.value?.introduceRef, popover: {title: '第二步', description: '这是工具介绍'}},
    {element: guideStep3.value, popover: {title: '第三步', description: '对战难度'}},
    {element: guideStep4.value, popover: {title: '第四步', description: '选择执子方'}},
    {element: guideStep5.value, popover: {title: '第五步', description: '开始对局'}},
    {element: guideStep6.value, popover: {title: '第六步', description: '这是棋盘'}},
  ].filter(item => item.element);
  if (steps.length > 0) guide(steps, config);
}

function chessChage(index, player, arr) {
  tips.value = '当前执手方:';
  if (index === -1) {
    chessRecord.value = new Array(9).fill(null).map(() => ({ pos: null, player: '' }));
    role.value = player;
    return;
  }
  
  role.value = player === 'x' ? 'o' : 'x';
  const num = chessRecord.value.findIndex(item => !item.player && item.pos === null);
  if (num === -1) return;
  chessRecord.value[num] = { pos: index + 1, player: player };
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

function startVersus() {
  buttonClick({
    pageName: 'tictactoe_ai',
    name: 'tictactoe_ai_startVersus',
    IdNum: 'tictactoe_ai_startVersus',
    textInfo: '井字棋AI工具--点击开始对战按钮'
  })
  // chessBoardBoxRef.value.setRole(player.value);
  if (player.value == 'o') chessBoardBoxRef.value.aiSelect();
  chessBoardBoxRef.value.setLevel(props.level);
  status.value = true;
  chessBoardBoxRef.value.reset();
}

function showSelect() {
  visible.value = true;
}

function selectRole(val) {
  player.value = val;
  visible.value = false;
}

</script>

<template>
  <div class="versus-container">
    <div class="versus-content" ref="guideStep1">
      <div class="info-box">
        <div ref="guideStep4">
        <h5>选择执子方</h5>
          <div class="custom-select">
            <div class="res" @click="showSelect">
              <div class="res-val"><span :class="'chess-icon ' + player"></span>{{ player === 'x' ? '先手方' : '后手方' }}</div>
              <i class="icon"></i>
            </div>
            <ul v-if="visible">
              <li @click="selectRole('x')"><span class="chess-icon x"></span>先手方</li>
              <li @click="selectRole('o')"><span class="chess-icon o"></span>后手方</li>
            </ul>
            <div class="mask" v-show="status"></div>
          </div>
        </div>
        <button class="start-btn" @click="startVersus" :disabled="state < 2 || status" :title="state < 2 ? '请先“训练模型”再开始对战' : ''" ref="guideStep5">开始新棋局</button>
        <p class="level-tips" ref="guideStep3">当前AI难度 <span>{{ state < 2 ? '---' : level === 'hard' ? '困难' : level === 'normal' ? '一般' : '简单' }}</span></p>
      </div>
      <div class="chess-box" ref="guideStep6">
        <div class="chess-top">
          <h4>AI对战</h4>
          <div class="tips">
            <span>{{ tips }}</span>
            <i v-if="role" :class="'chess-icon ' + role"></i>
          </div>
        </div>
        <div class="chess-board">
          <Chessboard
            ref="chessBoardBoxRef"
            :onChage="chessChage"
            :onOver="onOver"
            :mode="'pve'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.versus-content {
  width: 948px;
  height: 694px;
  display: flex;
  border-radius: 18px;
  box-shadow:  0px 12px 48px 0px rgba(13,13,13,0.14);
  background: #FFFFFF;
  margin: 0 auto;
  overflow: hidden;
}



.info-box {
  width: 31.646%;
  height: 100%;
  padding: 24px;
  position: relative;
}
.info-box h5 {
  font-size: 18px;
  color: #333;
  font-weight: 400;
  margin-bottom: 10px;
}

.custom-select {
  width: 100%;
  height: 46px;
  font-size: 16px;
  line-height: 46px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background: #FFFFFF;
  position: relative;
}
.custom-select .res {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: pointer;
}
.custom-select .res-val {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}
.custom-select .res .icon {
  width: 18px;
  height: 18px;
  display: block;
  background: url(./../images/custom-select-arrow.png) no-repeat center;
}
.custom-select > ul {
  width: 100%;
  height: auto;
  padding: 4px 0;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: absolute;
  top: 46px;
  left: 0;
}
.custom-select > ul > li {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
}
.custom-select > ul > li:hover {
  background-color: rgba(77, 57, 182, 0.1);
}
.custom-select .mask {
  width: 100%;
  height: 100%;
  cursor: no-drop;
  background-color: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 0;
  left: 0;
}
.custom-select .chess-icon {
  margin-right: 6px;
}

.start-btn {
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
.start-btn[disabled] {
  background-color: rgba(77, 57, 182, 0.5);
  cursor: no-drop;
}
.start-btn:not([disabled]):hover {
  box-shadow:  0px 8px 16px 0px rgba(77, 57, 182, 0.2);
}

.level-tips {
  width: 252px;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 6px;
  background: #F6F6FC;
  position: absolute;
  bottom: 24px;
  left: 24px;
}
.level-tips span {
  color: #F87D57;
}



.chess-box {
  width: 68.354%;
  height: 100%;
  padding: 24px;
}
.chess-top {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.chess-top h4 {
  font-size: 24px;
  color: #333;
  font-weight: 400;
}

.chess-top .tips {
  width: min-content;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.chess-top .tips span {
  width: max-content;
  font-size: 18px;
  line-height: 28px;
  color: #757575;
  margin-right: 8px;
}
.chess-icon {
  width: 28px;
  height: 28px;
  display: block;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px auto;
}
.chess-icon.x {
  background-image: url(./../images/x-icon.png);
}
.chess-icon.o {
  background-image: url(./../images/o-icon.png);
}

.chess-board {
  width: 600px;
  height: calc(100% - 46px);
  padding: 24px;
  border-radius: 18px;
  background: #F6F6FC;
}
</style>