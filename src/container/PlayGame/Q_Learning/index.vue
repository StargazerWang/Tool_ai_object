<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue';

// ==== 1. 常量与参数 ====
const rows = 3;
const cols = 3;
const startPos = { r: rows - 1, c: 0 };
const goalPos = { r: 0, c: cols - 1 };
const maxStepsPerEpisode = 200;

// 响应式参数
const params = reactive({
  alpha: 0.5,
  gamma: 0.9,
  epsilon: 0.1,
  speed: 50
});

// 状态追踪
const episodeCount = ref(0);
const currentStep = ref(0);
const isTraining = ref(false);
const canvasRef = ref(null);
const showSidebar = ref(false);
let trainTimer = null;

// Q 表
let Q = new Float32Array(rows * cols * 4);

// 陷阱数据
const traps = ref([{ r: 2, c: 2 }, { r: 3, c: 4 }]);

// R 表数据
const rTableValues = reactive(new Array(rows * cols).fill(-0.01));

// 动作定义
const ACTIONS = [{ dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }];

// ==== 2. 辅助函数 ====
const stateIndex = (r, c) => r * cols + c;
const qIndex = (s, a) => s * 4 + a;

const isTrap = (r, c) => traps.value.some(t => t.r === r && t.c === c);
const isGoal = (r, c) => r === goalPos.r && c === goalPos.c;
const isStart = (r, c) => r === startPos.r && c === startPos.c;
const isTerminal = (r, c) => isGoal(r, c) || isTrap(r, c);

const getCellType = (index) => {
  const r = Math.floor(index / cols);
  const c = index % cols;
  if (isGoal(r, c)) return 'goal';
  if (isTrap(r, c)) return 'trap';
  if (isStart(r, c)) return 'start';
  return 'normal';
};

const getReward = (r, c) => rTableValues[stateIndex(r, c)];

// ==== 3. 核心算法逻辑 ====
const resetQ = () => {
  Q = new Float32Array(rows * cols * 4);
  episodeCount.value = 0;
  currentStep.value = 0;
  render();
};

const resetRValuesToDefault = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let idx = stateIndex(r, c);
      let val = -0.01;
      if (isGoal(r, c)) val = 1.0;
      else if (isTrap(r, c)) val = -1.0;
      rTableValues[idx] = val;
    }
  }
};

const sampleAction = (s) => {
  if (Math.random() < params.epsilon) return Math.floor(Math.random() * 4);
  let base = s * 4;
  let bestA = 0;
  let bestV = Q[base + 0];
  for (let a = 1; a < 4; a++) {
    let v = Q[base + a];
    if (v > bestV) { bestV = v; bestA = a; }
  }
  return bestA;
};

const maxQofState = (s) => {
  let base = s * 4;
  let m = Q[base];
  for (let a = 1; a < 4; a++) {
    if (Q[base + a] > m) m = Q[base + a];
  }
  return m;
};

const stepEnvironment = (r, c, action) => {
  const move = ACTIONS[action];
  let nr = r + move.dr;
  let nc = c + move.dc;
  if (nr < 0) nr = 0; if (nr >= rows) nr = rows - 1;
  if (nc < 0) nc = 0; if (nc >= cols) nc = cols - 1;
  return { r: nr, c: nc };
};

const runOneEpisode = async () => {
  let r = startPos.r;
  let c = startPos.c;

  for (let step = 0; step < maxStepsPerEpisode; step++) {
    currentStep.value = step + 1;
    let s = stateIndex(r, c);

    let a = sampleAction(s);
    let next = stepEnvironment(r, c, a);
    let nr = next.r; let nc = next.c;
    let ns = stateIndex(nr, nc);

    let rew = getReward(nr, nc);
    let nextIsTerm = isTerminal(nr, nc);

    let idx = qIndex(s, a);
    let tdTarget = rew + params.gamma * (nextIsTerm ? 0 : maxQofState(ns));
    Q[idx] = Q[idx] + params.alpha * (tdTarget - Q[idx]);

    r = nr; c = nc;
    if (nextIsTerm) break;
  }
  episodeCount.value++;
};

// ==== 4. 控制逻辑 ====
const startTraining = () => {
  if (isTraining.value) return;
  isTraining.value = true;
  if(trainTimer) clearInterval(trainTimer);
  trainTimer = setInterval(async () => {
    await runOneEpisode();
    render();
  }, Math.max(1, 205 - params.speed));
};

const pauseTraining = () => {
  isTraining.value = false;
  if (trainTimer) { clearInterval(trainTimer); trainTimer = null; }
};

const stepOnce = async () => {
  await runOneEpisode();
  render();
};

const randomizeTraps = () => {
  traps.value = [];
  const count = 1;
  while (traps.value.length < count) {
    let rr = Math.floor(Math.random() * rows);
    let cc = Math.floor(Math.random() * cols);
    if ((rr === startPos.r && cc === startPos.c) || (rr === goalPos.r && cc === goalPos.c)) continue;
    if (!traps.value.find(t => t.r === rr && t.c === cc)) traps.value.push({ r: rr, c: cc });
  }
  resetRValuesToDefault();
  resetQ();
  render();
};

const handleRValueChange = (index, event) => {
  let val = parseFloat(event.target.value);
  if(isNaN(val)) val = -0.01;
  rTableValues[index] = val;
  render();
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// ==== 5. Canvas 渲染逻辑 ====
const render = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvasRef.value.getBoundingClientRect();

  if (canvasRef.value.width !== rect.width * dpr || canvasRef.value.height !== rect.height * dpr) {
    canvasRef.value.width = rect.width * dpr;
    canvasRef.value.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  const W = rect.width;
  const H = rect.height;
  const cellW = W / cols;
  const cellH = H / rows;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, W, H);

  let maxQ = -Infinity, minQ = Infinity;
  for (let s = 0; s < rows * cols; s++) {
    for (let a = 0; a < 4; a++) {
      let v = Q[qIndex(s, a)];
      if (v > maxQ) maxQ = v;
      if (v < minQ) minQ = v;
    }
  }
  if (!isFinite(maxQ)) { maxQ = 1; minQ = -1; }
  if (maxQ === minQ) { maxQ = minQ + 1; }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW; const y = r * cellH;
      let s = stateIndex(r, c);

      // 绘制方块
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 4, cellW - 8, cellH - 8);

      // 边框
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, cellW - 8, cellH - 8);

      // 特殊方块颜色 - Q表视图
      if (isStart(r, c)) ctx.fillStyle = '#d0cdff';
      if (isGoal(r, c)) ctx.fillStyle = '#d4edda';
      if (isTrap(r, c)) ctx.fillStyle = '#f8d7da';

      if (isTerminal(r, c) || isStart(r,c)) {
        ctx.fillRect(x + 4, y + 4, cellW - 8, cellH - 8);
        ctx.strokeStyle = isStart(r,c)?'#6200ea':(isGoal(r,c)?'#28a745':'#dc3545');
        ctx.strokeRect(x + 4, y + 4, cellW - 8, cellH - 8);
      }

      const cx = x + cellW / 2;
      const cy = y + cellH / 2;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      if (!isTerminal(r, c)) {
        let base = s * 4; let bestA = 0; let bestV = Q[base + 0];
        for (let a = 1; a < 4; a++) { if (Q[base + a] > bestV) { bestV = Q[base + a]; bestA = a; } }

        drawArrow(ctx, cx, cy - 10, bestA, '#343a40');

        ctx.font = 'bold 14px "MiSans", "Inter", sans-serif';
        ctx.fillStyle = '#343a40';
        ctx.fillText(bestV.toFixed(2), cx, cy + 20);

        if (isStart(r, c)) {
          ctx.font = '12px "MiSans", sans-serif';
          ctx.fillStyle = '#6200ea';
          ctx.fillText('起点', cx, cy + 40);
        }
      } else {
        ctx.font = 'bold 16px "MiSans", sans-serif';
        ctx.fillStyle = isGoal(r,c) ? '#28a745' : '#dc3545';
        let label = isGoal(r,c) ? "终点" : "陷阱";
        ctx.fillText(label, cx, cy);
      }
    }
  }
};

const drawArrow = (ctx, cx, cy, action, color) => {
  ctx.save();
  ctx.translate(cx, cy);
  let angle = [ -Math.PI/2, 0, Math.PI/2, Math.PI ][action];
  ctx.rotate(angle);
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(2, -6); ctx.lineTo(2, 6); ctx.closePath();
  ctx.fillStyle = color; ctx.fill();
  ctx.restore();
};

// ==== 6. 生命周期 ====
onMounted(() => {
  randomizeTraps();
  watch(params, () => {
    if(isTraining.value) {
      pauseTraining();
      startTraining();
    }
  }, { deep: true });
  window.addEventListener('resize', render);
});

onBeforeUnmount(() => {
  pauseTraining();
  window.removeEventListener('resize', render);
});
</script>

<template>
  <div class="q-learning-page">
    <header class="top-bar">
      <div class="bar-left">训练模型玩游戏</div>
      <div class="bar-right">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
          </svg>
        </div>
        <button class="tool-toggle-btn" @click="toggleSidebar">
          <span class="inner-line"></span>
        </button>
      </div>
    </header>

    <div class="main-body-container">
      <div class="main-white-card">

        <div class="card-content-grid">

          <div class="left-column">
            <div class="params-section">
              <div class="control-item">
                <div class="row-label">
                  <label>学习率α</label>
                  <span class="val">{{ params.alpha.toFixed(2) }}</span>
                </div>
                <input type="range" v-model.number="params.alpha" min="0" max="1" step="0.01" class="custom-slider" />
                <p class="tips">决定了新信息覆盖旧信息的程度</p>
              </div>

              <div class="control-item">
                <div class="row-label">
                  <label>折扣因子γ</label>
                  <span class="val">{{ params.gamma.toFixed(2) }}</span>
                </div>
                <input type="range" v-model.number="params.gamma" min="0" max="0.999" step="0.01" class="custom-slider" />
                <p class="tips">决定了对未来奖励的重视程度</p>
              </div>

              <div class="control-item">
                <div class="row-label">
                  <label>探索率ε</label>
                  <span class="val">{{ params.epsilon.toFixed(2) }}</span>
                </div>
                <input type="range" v-model.number="params.epsilon" min="0" max="1" step="0.01" class="custom-slider" />
                <p class="tips">决定了随机探索的可能性</p>
              </div>

              <div class="control-item">
                <div class="row-label">
                  <label>速度(ms)</label>
                  <span class="val">{{ params.speed }}</span>
                </div>
                <input type="range" v-model.number="params.speed" min="5" max="200" step="5" class="custom-slider" />
                <p class="tips">训练播放速度</p>
              </div>
            </div>

            <div class="r-table-container">
              <div class="r-table-card">
                <div class="r-header">R表</div>
                <div class="r-table-grid">
                  <div
                      v-for="(val, index) in rTableValues"
                      :key="index"
                      class="r-cell"
                      :class="getCellType(index)"
                  >
                    <input
                        type="number"
                        :value="val"
                        @input="handleRValueChange(index, $event)"
                        :readonly="getCellType(index) !== 'normal'"
                        step="0.1"
                    />
                  </div>
                </div>
              </div>

              <button @click="randomizeTraps" class="random-btn">随机障碍</button>
            </div>
          </div>

          <div class="right-column">
            <div class="q-header">
              <h3>Q表</h3>
              <div class="meta">回合: <span>{{ episodeCount }}</span> · 步数: <span>{{ currentStep }}</span></div>
              <button @click="resetQ" class="reset-btn">重置Q表</button>
            </div>
            <div class="canvas-wrapper">
              <canvas ref="canvasRef"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-action-bar">
        <button @click="startTraining" :disabled="isTraining" class="big-btn start-btn">
          开始训练
        </button>
        <button @click="pauseTraining" :disabled="!isTraining" class="big-btn pause-btn">
          暂停
        </button>
        <button @click="stepOnce" class="big-btn step-btn">
          训练一步
        </button>
      </div>
    </div>

    <aside class="right-sidebar" :class="{ open: showSidebar }">
      <div class="sidebar-header">
        <h3>工具介绍</h3>
        <button class="tool-toggle-btn close-style" @click="toggleSidebar">
          <span class="inner-line"></span>
        </button>
      </div>
      <div class="sidebar-content">
        <h4>Q-learning</h4>
        <p>Q-learning 是一种无模型 (Model-Free) 的强化学习算法。</p>
        <h4>规则更新：</h4>
        <p>在Q表区域，起点、终点和陷阱的奖励是固定的。</p>
        <div class="legend">
          <div class="legend-item"><span class="dot start"></span>起点</div>
          <div class="legend-item"><span class="dot goal"></span>目标</div>
          <div class="legend-item"><span class="dot trap"></span>陷阱</div>
        </div>
        <p>在R表区域，仅白色文字区域可修改。</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* 字体定义 */
@import url('https://gs.jurieo.com/gemini/fonts-googleapis/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.q-learning-page {
  width: 2048px;
  height: 1200px;
  background: #f5f5f5;
  font-family: 'MiSans', 'Noto Sans SC', sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* ==== 顶部标题栏 ==== */
.top-bar {
  width: 2048px;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.20);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 20;
}

.bar-left {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #4d39b6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.user-avatar svg { width: 20px; height: 20px; }

.tool-toggle-btn {
  width: 24px;
  height: 18px;
  background: #ffffff;
  border: 2px solid #333333;
  border-radius: 2px;
  padding: 0;
  cursor: pointer;
  display: flex;
  position: relative;
}
.tool-toggle-btn .inner-line {
  position: absolute;
  top: 0;
  right: 6px;
  width: 2px;
  height: 100%;
  background: #333333;
}
.close-style { transform: rotate(90deg); }

/* ==== 主体容器 ==== */
.main-body-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
  gap: 40px;
}

/* ==== 白色大卡片 ==== */
.main-white-card {
  width: 1180px;
  height: 860px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0px 12px 48px 0px rgba(13,13,13,0.14);
  display: flex;
  padding: 0; /* 内部列有自己的填充 */
  box-sizing: border-box;
  overflow: hidden;
}

.card-content-grid {
  width: 100%;
  height: 100%;
  display: flex;
}

/* ==== 左侧栏 (矩形 549) ==== */
.left-column {
  width: 376px;
  height: 100%;
  background: #ffffff;
  /* 右边框分割线 (可选，原设计好像是无缝的，这里加个浅色边距或者无) */
  /* border-right: 1px solid #f0f0f0; */
  padding: 27px 47px; /* 根据 x=254 start, controls x=301 -> ~47px padding */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 参数控制区 */
.params-section { display: flex; flex-direction: column; gap: 24px; }
.control-item { display: flex; flex-direction: column; gap: 10px; }

.row-label {
  display: flex; justify-content: space-between;
  font-size: 18px; color: #333; font-weight: 600; /* Semibold */
}
.row-label .val {
  font-weight: 400; /* Regular */
  color: #333;
}
.tips { font-size: 14px; color: #757575; margin: 0; font-weight: 400; }

/* 滑块样式 */
.custom-slider {
  -webkit-appearance: none;
  width: 280px;
  height: 6px;
  border-radius: 3px;
  background: rgba(77,57,182,0.10);
  outline: none;
  margin: 5px 0;
}
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #4d39b6;
  cursor: pointer;
}

/* R表区域 */
.r-table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

/* R表白色卡片 (矩形 568) */
.r-table-card {
  width: 280px;
  height: 326px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0px 12px 48px 0px rgba(13,13,13,0.14);
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.r-header {
  font-size: 18px; font-weight: 600; color: #000000;
}

.r-table-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.r-cell {
  width: 77px; height: 77px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.r-cell input {
  width: 100%; background: transparent; border: none; text-align: center;
  font-size: 18px; font-weight: 400; outline: none;
}

/* 单元格颜色定义 */
.r-cell.normal { background: #f5f5f5; }
.r-cell.normal input { color: #757575; }

.r-cell.start { background: #edebf8; } /* 浅紫 */
.r-cell.start input { color: #757575; }

.r-cell.trap { background: #f87d57; } /* 橙色 */
.r-cell.trap input { color: #ffffff; }

.r-cell.goal { background: #4d39b6; } /* 深紫 */
.r-cell.goal input { color: #ffffff; }

/* 随机障碍按钮 */
.random-btn {
  width: 280px;
  height: 48px;
  background: #4d39b6;
  border-radius: 12px;
  box-shadow: 0px 12px 48px 0px rgba(13,13,13,0.14);
  border: none;
  color: white;
  font-size: 18px; font-weight: 500;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.random-btn:active { opacity: 0.9; }

/* ==== 右侧栏 (Q表) ==== */
.right-column {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}
.q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.q-header h3 { font-size: 18px; margin: 0; }
.meta { font-size: 14px; color: #666; }
.reset-btn {
  padding: 6px 12px; background: #4d39b6; color: white; border: none; border-radius: 6px; cursor: pointer;
}

.canvas-wrapper {
  flex: 1;
  width: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}
canvas { width: 100%; height: 100%; display: block; }

/* ==== 底部大按钮组 ==== */
.bottom-action-bar {
  display: flex;
  gap: 38px;
}

.big-btn {
  width: 352px;
  height: 74px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: 'MiSans', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
  display: flex; align-items: center; justify-content: center;
}
.big-btn:active { transform: scale(0.98); }

.start-btn, .step-btn {
  background: #4d39b6;
  box-shadow: 0px 12px 48px 0px rgba(13,13,13,0.14);
}
.start-btn:disabled, .step-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.pause-btn {
  background: rgba(77, 57, 182, 0.50);
}
.pause-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ==== 侧边栏 ==== */
.right-sidebar {
  position: absolute;
  top: 60px; right: 0; bottom: 0;
  width: 300px;
  background: #fff;
  border-left: 1px solid #eee;
  padding: 24px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 30;
  box-shadow: -5px 0 15px rgba(0,0,0,0.05);
}
.right-sidebar.open { transform: translateX(0); }

.sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.legend { display: flex; gap: 10px; margin: 10px 0; }
.dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 5px; }
.dot.start { background: #d0cdff; border: 1px solid #4d39b6;}
.dot.goal { background: #d4edda; }
.dot.trap { background: #ff7043; }

</style>