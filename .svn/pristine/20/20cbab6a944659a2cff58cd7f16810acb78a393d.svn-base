<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,#071025 0%, #081428 100%);
  font-family: system-ui, Segoe UI, Roboto, "Helvetica Neue", Arial;
  background: #0b1220;
  color: #e6eef8;
}

.title {
  text-align: center;
  margin: 20px 0;
}

.content {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.tool-introduce {
  min-width: 100px;
  max-width: 200px;
  font-size: 16px;
  color: #ccc;
  padding-right: 20px;
}

canvas {
  background: #70c5ce;
  border: 4px solid #04293a;
  border-radius: 8px;
}

.panel {
  display: flex;
  gap: 12px;
}

.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 0;
  background: #1b6ca8;
  color: white;
  cursor: pointer;
}

button.secondary {
  background: #4b5563;
}

.status {
  min-width: 320px;
  font-size: 16px;
  line-height: 24px;
  background: #071322;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #133444;
}

pre {
  white-space: pre-wrap;
  color: #dbeafe;
  overflow: auto;
}

.topright {
  position: absolute;
  right: 34px;
  top: 18px;
  background: rgba(2, 6, 23, 0.7);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.ui {
  position: relative;
}

.grid {
  height: 350px;
  font-family: monospace;
  line-height: 1;
  font-size: 14px;
  letter-spacing: 1px;
}

label {
  display: flex;
  gap: 8px;
  align-items: center;
}

input[type="range"] {
  width: 160px;
}

footer {
  margin-top: 12px;
  font-size: 12px;
  color: #90a4b7;
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #4b5563;
  background: #1b6ca8;
  color: white;
}

.visual-container {
  width: 420px;
  background: #0a0f1c;
  padding: 8px;
  border-radius: 8px;
  overflow: auto;
  border: 1px solid #133444;
}

.visual-row {
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
}

.visual-cell {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.cell-0 {
  color: #4a5568;
  background: #1a202c;
}

.cell-1 {
  color: #68d391;
  background: #22543d;
}

.grid-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.grid-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.score-display {
  font-size: 18px;
  font-weight: bold;
  color: #ffdd57;
  margin-top: 8px;
}
</style>

<template>
  <div class="container">
    <h2 class="title">Fly Bird</h2>
    <div class="content">
      <div class="tool-introduce">
        <b>简介：</b><br />
        玩家通过空格控制小鸟（黄色块）向上飞和自然下落。小鸟需穿过一系列上下排列的管道障碍物（绿色块）；
        视觉状态是将游戏画面做缩放和二值化处理后的游戏画面，也是AI会看到的画面；
        状态描述内包含小鸟的坐标位置以及管道的通道位置，小鸟的存活和穿过管道会得分
      </div>
      <div class="ui">
        <div style="position: relative; display: inline-block">
          <canvas
            ref="canvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @mousedown="handleMouseDown"
          ></canvas>
          <div class="topright">
            画面尺寸: {{ canvasWidth }}×{{ canvasHeight }}
          </div>
        </div>
        <div class="controls">
          <button @click="startGame">
            {{ gamePlaying && alive ? "暂停" : alive ? "继续" : "开始" }}
          </button>
          <button @click="resetGame" class="secondary">重置</button>
          <button @click="toggleAIControl">
            {{ aiControl ? "切换到 人控" : "切换到 AI 控制" }}
          </button>
          <select v-model="aiLevel" @change="updateAILevelText">
            <option value="smart">聪明 AI</option>
            <option value="medium">中等 AI</option>
            <option value="dumb">较笨 AI</option>
          </select>
        </div>
      </div>

      <div class="panel">
        <div class="visual-container">
          <div><strong>视觉状态（简化 0/1）</strong></div>
          <div class="grid-title">
            <span>{{ gridWidth }}×{{ gridHeight }} 网格</span>
            <div class="grid-legend">
              <div class="legend-item">
                <div class="legend-color" style="background: #22543d"></div>
                <span>1 (障碍物)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #1a202c"></div>
                <span>0 (背景)</span>
              </div>
            </div>
          </div>
          <div class="grid" id="visual">
            <div
              v-for="(row, rowIndex) in visualGrid"
              :key="rowIndex"
              class="visual-row"
            >
              <div
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="visual-cell"
                :class="`cell-${cell}`"
              >
                {{ cell }}
              </div>
            </div>
          </div>
        </div>

        <div class="status">
          <div><strong>状态描述（实时）</strong></div>
          <pre>{{ stateDescription }}</pre>
          <div class="score-display">得分: {{ score.toFixed(1) }}</div>
          <div style="margin-top: 8px; display: none">
            <strong>奖励值：</strong>{{ reward.toFixed(3) }}
          </div>
          <div style="margin-top: 8px">
            <strong>AI 水平：</strong>{{ aiLevelText }}
          </div>
          <div style="margin-top: 8px">
            <strong>AI 决策：</strong>{{ aiDecision }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";

// 游戏常量
const canvasWidth = 420;
const canvasHeight = 420;
const gridWidth = 21;
const gridHeight = 21;

// 游戏状态
const gamePlaying = ref(false);
const aiControl = ref(false);
const aiLevel = ref("smart");
const aiLevelText = ref("聪明");
const aiDecision = ref("-");

// 游戏对象
const bird = reactive({
  x: 80,
  y: canvasHeight / 2,
  vy: 0,
  w: 28,
  h: 20,
});

const pipes = reactive([]);

// 游戏数据
const score = ref(0);
const reward = ref(0);
const frame = ref(0);
const alive = ref(false);

// 视觉网格
const visualGrid = ref([]);

// 画布引用
const canvas = ref(null);
let ctx = null;

// 游戏常量
const gravity = 0.7;
const flapV = -7;
const pipeSpeed = 2.2;

// 状态描述
const stateDescription = computed(() => {
  const nextPipes = getNextTwoPipes();
  const p1 = nextPipes[0] || { x: Infinity, gapY: 0, gapH: 0 };
  const p2 = nextPipes[1] || { x: Infinity, gapY: 0, gapH: 0 };
  const dist1 = Math.round(p1.x - bird.x);
  const dist2 = Math.round(p2.x - bird.x);

  return (
    `小鸟位置: (${Math.round(bird.x)}, ${Math.round(bird.y)})\n` +
    `通道1 距离: ${dist1}，坐标: X=${Math.round(p1.x)}, Y=${Math.round(
      p1.gapY
    )}\n` +
    `通道2 距离: ${dist2}，坐标: X=${Math.round(p2.x)}, Y=${Math.round(
      p2.gapY
    )}`
  );
});

// 初始化视觉网格
const initVisualGrid = () => {
  const grid = [];
  for (let y = 0; y < gridHeight; y++) {
    const row = [];
    for (let x = 0; x < gridWidth; x++) {
      row.push(0);
    }
    grid.push(row);
  }
  visualGrid.value = grid;
};

// 生成管道
const spawnPipe = () => {
  const gapH = 120;
  const gapY = 80 + Math.random() * (canvasHeight - 160 - gapH);
  pipes.push({
    x: canvasWidth,
    gapY,
    gapH,
    _passed: false,
  });
};

// 重置游戏
const resetGame = () => {
  bird.x = 80;
  bird.y = canvasHeight / 2;
  bird.vy = 0;

  pipes.length = 0;

  score.value = 0;
  reward.value = 0;
  frame.value = 0;
  alive.value = true;

  for (let i = 0; i < 3; i++) {
    spawnPipe();
    pipes[i].x += i * 180;
  }

  initVisualGrid();
};

// 获取最近的管道
const getNextTwoPipes = () => {
  const ahead = pipes
    .filter((p) => p.x + 60 >= bird.x)
    .sort((a, b) => a.x - b.x);
  const p1 = ahead[0] || { x: Infinity, gapY: 0, gapH: 0 };
  const p2 = ahead[1] || { x: Infinity, gapY: 0, gapH: 0 };
  return [p1, p2];
};

// 检测碰撞
const checkCollision = () => {
  for (const p of pipes) {
    if (bird.x + bird.w > p.x && bird.x < p.x + 60) {
      if (bird.y < p.gapY || bird.y + bird.h > p.gapY + p.gapH) return true;
    }
  }
  if (bird.y < 0 || bird.y + bird.h > canvasHeight) return true;
  return false;
};

// 小鸟跳跃
const flap = () => {
  if (!alive.value) return;
  bird.vy = flapV;
};

// 处理鼠标点击
const handleMouseDown = (e) => {
  if (!aiControl.value) flap();
  e.preventDefault();
};

// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.code === "Space") {
    if (!aiControl.value) flap();
    e.preventDefault();
  }
};

// 更新视觉网格
const updateVisualGrid = () => {
  // 创建离屏画布
  const off = document.createElement("canvas");
  off.width = gridWidth;
  off.height = gridHeight;
  const octx = off.getContext("2d");

  // 绘制背景
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, off.width, off.height);

  // 绘制管道
  octx.fillStyle = "#000";
  for (const p of pipes) {
    const scaleX = off.width / canvasWidth;
    const scaleY = off.height / canvasHeight;
    const px = Math.round(p.x * scaleX);
    const pw = Math.round(60 * scaleX);
    const gy = Math.round(p.gapY * scaleY);
    const gh = Math.round(p.gapH * scaleY);

    // 上管道
    octx.fillRect(px, 0, pw, gy);
    // 下管道
    octx.fillRect(px, gy + gh, pw, off.height - (gy + gh));
  }

  // 绘制小鸟
  octx.fillStyle = "#000";
  octx.fillRect(
    Math.round((bird.x * off.width) / canvasWidth),
    Math.round((bird.y * off.height) / canvasHeight),
    Math.max(1, Math.round((bird.w * off.width) / canvasWidth)),
    Math.max(1, Math.round((bird.h * off.height) / canvasHeight))
  );

  // 读取像素数据
  const data = octx.getImageData(0, 0, off.width, off.height).data;
  const grid = [];

  for (let y = 0; y < off.height; y++) {
    const row = [];
    for (let x = 0; x < off.width; x++) {
      const i = (y * off.width + x) * 4;
      const v = data[i] < 128 || data[i + 1] < 128 || data[i + 2] < 128 ? 1 : 0;
      row.push(v);
    }
    grid.push(row);
  }

  visualGrid.value = grid;
};

// 渲染游戏
const render = () => {
  if (!ctx) return;

  // 背景
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 管道
  ctx.fillStyle = "#0b5136";
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, 60, p.gapY);
    ctx.fillRect(p.x, p.gapY + p.gapH, 60, canvasHeight - (p.gapY + p.gapH));
  }

  // 小鸟
  ctx.fillStyle = "#ffdd57";
  ctx.fillRect(bird.x, bird.y, bird.w, bird.h);

  // 分数
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = "22px monospace";
  ctx.fillText("Score: " + score.value.toFixed(1), 12, 28);
};

// 游戏步进
const step = (dt = 1) => {
  if (!alive.value) return;

  frame.value++;

  // 计算前进距离
  const distanceMoved = pipeSpeed * dt;

  // 更新管道位置
  for (const p of pipes) p.x -= pipeSpeed * dt;
  if (pipes[0] && pipes[0].x < -80) {
    pipes.shift();
    spawnPipe();
  }

  // 更新小鸟位置
  bird.vy += gravity * dt;
  bird.y += bird.vy * dt;

  // 更新分数（前进得分）
  score.value += distanceMoved * 0.1;
  reward.value = distanceMoved * 0.1;

  // 检查是否通过管道
  for (const p of pipes) {
    if (!p._passed && p.x + 60 < bird.x) {
      p._passed = true;
      score.value += 1.0;
      reward.value = 1.0;
    }
  }

  // 检查碰撞
  if (checkCollision()) {
    alive.value = false;
    reward.value = -1.0;
    gamePlaying.value = false;
  }
};

// AI决策
const actSimulatedAI = () => {
  const [p1] = getNextTwoPipes();
  if (!p1 || !isFinite(p1.x)) return 0;

  const center = p1.gapY + p1.gapH / 2;
  const dx = p1.x - bird.x;
  const dy = bird.y - center;

  let decision = 0;
  let reason = "";

  switch (aiLevel.value) {
    case "smart":
      if (dx < 110 && dy > -6) {
        decision = 1;
        reason = "接近通道且位置偏高，跳跃";
      } else if (bird.vy > 4 && dy > -18) {
        decision = 1;
        reason = "下落速度快，紧急跳跃";
      } else {
        reason = "保持飞行";
      }
      break;

    case "medium":
      if (dx < 90 && dy > -10) {
        decision = 1;
        reason = "接近通道，跳跃";
      } else if (bird.vy > 6 && dy > -15) {
        decision = 1;
        reason = "下落速度很快，跳跃";
      } else if (Math.random() < 0.01) {
        decision = 1;
        reason = "随机跳跃";
      } else {
        reason = "保持飞行";
      }
      break;

    case "dumb":
      if (dx < 70 && dy > -5) {
        decision = 1;
        reason = "非常接近通道，跳跃";
      } else if (bird.vy > 8 && dy > -10) {
        decision = 1;
        reason = "下落速度极快，跳跃";
      } else if (Math.random() < 0.03) {
        decision = 1;
        reason = "随机跳跃";
      } else if (Math.random() < 0.02 && dx > 150) {
        decision = 1;
        reason = "过早跳跃";
      } else {
        reason = "保持飞行";
      }
      break;
  }

  aiDecision.value = reason;
  return decision;
};

// 游戏循环
let loopId = null;
let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

const gameLoop = (timestamp) => {
  if (!lastTime) lastTime = timestamp;

  const elapsed = timestamp - lastTime;

  if (elapsed > interval) {
    lastTime = timestamp - (elapsed % interval);

    if (gamePlaying.value) {
      // AI控制
      if (aiControl.value && alive.value) {
        const a = actSimulatedAI();
        if (a === 1) bird.vy = flapV;
      }

      step(1);
      render();
      updateVisualGrid();
    }
  }

  loopId = requestAnimationFrame(gameLoop);
};

// 开始游戏
const startGame = () => {
  gamePlaying.value = !gamePlaying.value;

  if (!alive.value) {
    resetGame();
  }
};

// 切换AI控制
const toggleAIControl = () => {
  aiControl.value = !aiControl.value;
};

// 更新AI级别文本
const updateAILevelText = () => {
  switch (aiLevel.value) {
    case "smart":
      aiLevelText.value = "聪明";
      break;
    case "medium":
      aiLevelText.value = "中等";
      break;
    case "dumb":
      aiLevelText.value = "较笨";
      break;
  }
};

// 初始化
onMounted(() => {
  // 获取画布上下文
  ctx = canvas.value.getContext("2d");

  // 初始化游戏
  // resetGame();
  // render();

  // 添加键盘事件监听
  window.addEventListener("keydown", handleKeyDown);

  // 启动游戏循环
  loopId = requestAnimationFrame(gameLoop);
});

// 清理
onUnmounted(() => {
  if (loopId) cancelAnimationFrame(loopId);
  window.removeEventListener("keydown", handleKeyDown);
});

// 监视AI级别变化
watch(aiLevel, updateAILevelText);
</script>
