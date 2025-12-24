<template>
  <div class="compare-page">
    <div class="main-content">
      <div class="header">
        <h2>⚔️ 模型巅峰对决：决策树 vs 单层感知机</h2>
        <div class="actions">
          <div class="help-group" id="guide-import">
            <input ref="fileInput" type="file" accept=".csv" style="display:none" @change="handleFileImport" />
            <button class="btn-import" @click="triggerFileInput">📄 导入CSV</button>
            <button class="btn-help" @click="startGuide">❓ 引导</button>
          </div>

          <div class="divider"></div>

          <div class="config-group" id="guide-config">
            <div class="config-item">
              <span class="config-label">数据集</span>
              <span class="dataset-badge" :class="{ empty: !csvRows.length }">
                {{ csvRows.length ? ((csvFileName || 'CSV') + ' (' + csvRows.length + '条)') : '未导入' }}
              </span>
            </div>
            <div class="config-item">
              <span class="config-label">对比来源</span>
              <select v-model="compareSource" class="config-select">
                <option value="builtin">内置演示模型</option>
                <option value="blockly">Blockly运行结果(预留)</option>
              </select>
            </div>
            <div class="config-item" v-if="csvHeaders.length">
              <span class="config-label">真实值列</span>
              <select v-model="actualCol" class="config-select">
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
            <button
              v-if="compareSource === 'blockly'"
              class="btn-help secondary"
              type="button"
              @click="loadBlocklyRunResults"
            >
              🔌 加载Blockly结果
            </button>
          </div>

          <div class="divider"></div>

          <div id="guide-action">
            <button class="btn-run" @click="runComparison" :disabled="isRunning">
              {{ isRunning ? '正在计算...' : '▶ 运行对比测试' }}
            </button>
            <div v-if="compareSource === 'blockly' && blocklyStatus" class="blockly-status">
              {{ blocklyStatus }}
            </div>
          </div>
        </div>
      </div>

      <div class="charts-area" id="guide-charts">
        <div class="chart-card">
          <h3>🏆 准确率对比</h3>
          <div ref="chartDom" style="width: 100%; height: 350px;"></div>
        </div>
        <div class="stats-card">
          <h3>📈 核心指标</h3>
          <div class="stat-item">
            <span class="label">样本总数</span>
            <span class="value">{{ totalSamples }}</span>
          </div>
          <div class="stat-item highlight-tree">
            <span class="label">决策树准确率</span>
            <span class="value">{{ treeAccuracy }}%</span>
          </div>
          <div class="stat-item highlight-pt">
            <span class="label">感知机准确率</span>
            <span class="value">{{ perceptronAccuracy }}%</span>
          </div>
        </div>
      </div>

      <div class="logs-container" id="guide-logs">
        <div class="log-box tree-box">
          <div class="log-header">{{ treeLogTitle }}</div>
          <div class="log-content">
            <table class="log-table">
              <thead><tr><th>ID</th><th>真实值</th><th>预测值</th><th>状态</th></tr></thead>
              <tbody>
              <tr v-for="item in treeResults" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.actual }}</td>
                <td>{{ item.pred }}</td>
                <td>
                  <span v-if="item.correct" class="badge-success">✔</span>
                  <span v-else class="badge-fail">✘</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="log-box pt-box">
          <div class="log-header">{{ perceptronLogTitle }}</div>
          <div class="log-content">
            <table class="log-table">
              <thead><tr><th>ID</th><th>真实值</th><th>预测值</th><th>状态</th></tr></thead>
              <tbody>
              <tr v-for="item in perceptronResults" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.actual }}</td>
                <td>{{ item.pred }}</td>
                <td>
                  <span v-if="item.correct" class="badge-success">✔</span>
                  <span v-else class="badge-fail">✘</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="introduce-wrapper">
      <Introduce :path="'/tool-introduce/model-compare/guide.md'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import guide from '@/utils/guide'; // [Guide]
import Introduce from '@/components/Introduce.vue';

// --- 状态 ---
const chartDom = ref(null);
const isRunning = ref(false);
const totalSamples = ref(0);
const treeAccuracy = ref(0);
const perceptronAccuracy = ref(0);
const treeResults = ref([]);
const perceptronResults = ref([]);
let myChart = null;

const fileInput = ref(null);
const csvFileName = ref('');
const csvHeaders = ref([]);
const csvRows = ref([]);
const actualCol = ref('');

const compareSource = ref('builtin');
const blocklyStatus = ref('');
const blocklyTreePredIndex = ref(null);
const blocklyPerceptronPredIndex = ref(null);

const treeLogTitle = computed(() => {
  return compareSource.value === 'blockly'
    ? '🌲 决策树 Blockly 运行结果'
    : '🌲 决策树预测结果 (规则推理)';
});

const perceptronLogTitle = computed(() => {
  return compareSource.value === 'blockly'
    ? '🧠 感知机 Blockly 运行结果'
    : '🧠 感知机预测结果 (线性权重)';
});

// --- 生命周期 ---
onMounted(() => {
  // 自动启动引导
  nextTick(() => { startGuide(); });
});

// --- [Guide] 引导配置 ---
const startGuide = () => {
  const steps = [
    {
      element: '#guide-import',
      popover: {
        title: '导入CSV',
        description: '先导入用于对比的数据集（与Blockly运行时使用的CSV保持一致效果更直观）。',
        side: "bottom",
        align: 'end'
      }
    },
    {
      element: '#guide-config',
      popover: {
        title: '选择来源',
        description: '可以选择使用内置演示模型，或切换为 Blockly 运行结果（当前为预留接口，可先用演示数据）。',
        side: "bottom",
        align: 'center'
      }
    },
    {
      element: '#guide-action',
      popover: {
        title: '开始对比',
        description: '点击运行按钮，系统会在同一份 CSV 上对两种模型进行预测，并统计准确率。',
        side: "bottom",
        align: 'end'
      }
    },
    {
      element: '#guide-charts',
      popover: {
        title: '可视化结果',
        description: '这里直观展示了两种模型的准确率差异。通常决策树会略胜一筹。',
        side: "bottom",
        align: 'center'
      }
    },
    {
      element: '#guide-logs',
      popover: {
        title: '详细预测日志',
        description: '左右对比每一条数据的预测结果，你可以找到那些“决策树对，但感知机错”的例子进行分析。',
        side: "top",
        align: 'center'
      }
    }
  ];
  guide(steps);
};

const triggerFileInput = () => { fileInput.value?.click(); };

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  values.push(current.trim());
  return values;
};

const parseCsvText = (text) => {
  const cleanText = String(text || '').replace(/^\ufeff/, '');
  const lines = cleanText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map(h => h.trim()).filter(Boolean);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    if (vals.length !== headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      const raw = (vals[idx] ?? '').trim();
      if (raw === '') {
        row[h] = '';
        return;
      }
      const num = Number(raw);
      row[h] = Number.isNaN(num) ? raw : num;
    });
    rows.push(row);
  }

  return { headers, rows };
};

const handleFileImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const { headers, rows } = parseCsvText(text);
    csvFileName.value = file.name || '';
    csvHeaders.value = headers;
    csvRows.value = rows;
    actualCol.value = headers.includes('出行方式') ? '出行方式' : (headers[headers.length - 1] || '');

    totalSamples.value = rows.length;
    treeAccuracy.value = 0;
    perceptronAccuracy.value = 0;
    treeResults.value = [];
    perceptronResults.value = [];
    blocklyStatus.value = '';
    blocklyTreePredIndex.value = null;
    blocklyPerceptronPredIndex.value = null;
    if (myChart) myChart.clear();

    alert('CSV文件导入成功！');
  } catch (e) {
    alert('CSV文件读取失败');
    console.error(e);
  }
  event.target.value = '';
};

// --- 1. 核心算法模拟 ---
const predictTree = (row) => {
  const dist = parseFloat(row['家校距离(km)']);
  const weather = row['天气状况'];
  const temp = parseFloat(row['温度(℃)']);
  if (['雨', '雪'].includes(weather)) return '坐车';
  if (dist < 2) return '步行';
  if (dist >= 2 && dist <= 10) {
    if (weather === '晴' && temp < 30 && temp > 10) return '骑车';
    return '坐车';
  }
  return '坐车';
};

const predictPerceptron = (row) => {
  const dist = parseFloat(row['家校距离(km)']) || 0;
  const temp = parseFloat(row['温度(℃)']) || 0;
  const scoreWalk = -2.0 * dist + 5.0;
  const scoreBike = -0.5 * Math.abs(dist - 5) + 3.0;
  const scoreBus = 1.0 * dist - 2.0;
  const scores = { '步行': scoreWalk, '骑车': scoreBike, '坐车': scoreBus };
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
};

const toIdLikeString = (val) => {
  if (val === null || val === undefined) return '';
  return typeof val === 'string' ? val : String(val);
};

const getRowId = (row, idx) => {
  const candidate = row?.['学生ID'] ?? row?.['ID'] ?? row?.['id'] ?? row?.['Id'] ?? row?.['学号'];
  const id = toIdLikeString(candidate);
  return id || String(idx + 1);
};

const BLOCKLY_TREE_RESULTS_STORAGE_KEY = 'jinshan-ai:blockly:decision-tree:runResults';
const BLOCKLY_PT_RESULTS_STORAGE_KEY = 'jinshan-ai:blockly:perceptron:runResults';

const readBlocklyRunResultsFromStorage = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.results)) return parsed.results;
  } catch (e) {
    return null;
  }
  return null;
};

const buildPredictionIndex = (results) => {
  const byId = new Map();
  const byIndex = [];

  (results || []).forEach((item, i) => {
    if (item === null || item === undefined) return;
    if (typeof item === 'string' || typeof item === 'number') {
      byIndex[i] = String(item);
      return;
    }
    if (typeof item !== 'object') return;

    const id = item.id ?? item.ID ?? item['学生ID'] ?? item['ID'] ?? '';
    const pred = item.pred ?? item.predict ?? item.result ?? item.output ?? item.value;
    const indexRaw = item.index ?? item.rowIndex ?? item.idx ?? item.row ?? i;

    if (pred === null || pred === undefined) return;
    const predStr = String(pred).trim();
    const idStr = toIdLikeString(id).trim();
    const indexNum = Number(indexRaw);
    const index = Number.isFinite(indexNum) ? indexNum : i;

    byIndex[index] = predStr;
    if (idStr) byId.set(idStr, predStr);
  });

  return { byId, byIndex };
};

const getPredictionFromIndex = (predIndex, rowId, idx) => {
  if (!predIndex) return null;
  if (rowId && predIndex.byId && predIndex.byId.has(rowId)) return predIndex.byId.get(rowId);
  if (predIndex.byIndex && predIndex.byIndex[idx] !== undefined) return predIndex.byIndex[idx];
  return null;
};

const getLabelOptions = (rows) => {
  const set = new Set();
  const col = actualCol.value;
  if (col) {
    rows.forEach(r => {
      const v = r?.[col];
      if (v === null || v === undefined) return;
      const s = String(v).trim();
      if (s) set.add(s);
    });
  }
  const arr = [...set];
  if (arr.length >= 2) return arr;
  return ['步行', '骑车', '坐车'];
};

const getAlternativeLabel = (labels, current) => {
  const curr = String(current ?? '').trim();
  for (const l of labels) {
    if (l !== curr) return l;
  }
  return curr || (labels[0] ?? '');
};

const generateFakeBlocklyPredictionIndex = (rows, modelType, labels) => {
  const byIndex = rows.map((row, idx) => {
    const base = modelType === 'tree' ? predictTree(row) : predictPerceptron(row);
    const shouldFlip = modelType === 'tree' ? (idx % 9 === 0) : (idx % 7 === 0);
    if (!shouldFlip) return base;
    return getAlternativeLabel(labels, base);
  });

  return { byId: new Map(), byIndex };
};

const ensureBlocklyPredictionIndexes = (rows) => {
  const labels = getLabelOptions(rows);

  const treeRaw = readBlocklyRunResultsFromStorage(BLOCKLY_TREE_RESULTS_STORAGE_KEY);
  const ptRaw = readBlocklyRunResultsFromStorage(BLOCKLY_PT_RESULTS_STORAGE_KEY);

  const treeIndex = treeRaw ? buildPredictionIndex(treeRaw) : generateFakeBlocklyPredictionIndex(rows, 'tree', labels);
  const ptIndex = ptRaw ? buildPredictionIndex(ptRaw) : generateFakeBlocklyPredictionIndex(rows, 'pt', labels);

  const status = (treeRaw || ptRaw)
    ? '已加载 Blockly 运行结果（未提供的部分使用演示数据补全）'
    : '未检测到 Blockly 运行结果，当前使用演示数据（已预留接入接口）';

  return { treeIndex, ptIndex, status };
};

const loadBlocklyRunResults = () => {
  if (!csvRows.value.length) {
    alert('请先导入CSV文件');
    return;
  }
  const ensured = ensureBlocklyPredictionIndexes(csvRows.value);
  blocklyTreePredIndex.value = ensured.treeIndex;
  blocklyPerceptronPredIndex.value = ensured.ptIndex;
  blocklyStatus.value = ensured.status;
};

// --- 2. 运行对比 ---
const runComparison = async () => {
  if (!csvRows.value || csvRows.value.length === 0) {
    alert('请先导入CSV文件');
    return;
  }
  if (!actualCol.value) {
    alert('请选择真实值列');
    return;
  }

  const requiredCols = ['家校距离(km)', '天气状况', '温度(℃)'];
  const missingCols = requiredCols.filter(c => !csvHeaders.value.includes(c));
  if (missingCols.length > 0) {
    alert(`CSV缺少必要列: ${missingCols.join(', ')}`);
    return;
  }

  isRunning.value = true;
  treeResults.value = [];
  perceptronResults.value = [];

  try {
    const data = csvRows.value;
    totalSamples.value = data.length;
    let treeCorrect = 0;
    let ptCorrect = 0;

    if (compareSource.value === 'blockly') {
      const ensured = (blocklyTreePredIndex.value && blocklyPerceptronPredIndex.value)
        ? { treeIndex: blocklyTreePredIndex.value, ptIndex: blocklyPerceptronPredIndex.value, status: blocklyStatus.value }
        : ensureBlocklyPredictionIndexes(data);
      blocklyTreePredIndex.value = ensured.treeIndex;
      blocklyPerceptronPredIndex.value = ensured.ptIndex;
      blocklyStatus.value = ensured.status;
    } else {
      blocklyStatus.value = '';
      blocklyTreePredIndex.value = null;
      blocklyPerceptronPredIndex.value = null;
    }

    const treeIndex = blocklyTreePredIndex.value;
    const ptIndex = blocklyPerceptronPredIndex.value;

    data.forEach((row, idx) => {
      const id = getRowId(row, idx);
      const actual = String(row?.[actualCol.value] ?? '').trim();
      const actualDisplay = actual === '' ? '-' : actual;

      let pTree = '';
      if (compareSource.value === 'blockly') {
        pTree = getPredictionFromIndex(treeIndex, id, idx);
        if (pTree === null) pTree = predictTree(row);
      } else {
        pTree = predictTree(row);
      }
      pTree = String(pTree ?? '').trim();
      const isTreeRight = pTree === actual;
      if (isTreeRight) treeCorrect++;
      treeResults.value.push({ id, actual: actualDisplay, pred: pTree, correct: isTreeRight });

      let pPt = '';
      if (compareSource.value === 'blockly') {
        pPt = getPredictionFromIndex(ptIndex, id, idx);
        if (pPt === null) pPt = predictPerceptron(row);
      } else {
        pPt = predictPerceptron(row);
      }
      pPt = String(pPt ?? '').trim();
      const isPtRight = pPt === actual;
      if (isPtRight) ptCorrect++;
      perceptronResults.value.push({ id, actual: actualDisplay, pred: pPt, correct: isPtRight });
    });

    treeAccuracy.value = totalSamples.value ? ((treeCorrect / totalSamples.value) * 100).toFixed(1) : 0;
    perceptronAccuracy.value = totalSamples.value ? ((ptCorrect / totalSamples.value) * 100).toFixed(1) : 0;

    updateChart();

  } catch (e) {
    alert("对比失败");
    console.error(e);
  } finally {
    isRunning.value = false;
  }
};

const updateChart = () => {
  if (!myChart) myChart = echarts.init(chartDom.value);
  const categories = compareSource.value === 'blockly'
    ? ['Blockly 决策树', 'Blockly 感知机']
    : ['决策树 (Tree)', '单层感知机 (Perceptron)'];
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: categories, axisLabel: { fontSize: 14, fontWeight: 'bold' } },
    yAxis: { type: 'value', max: 100, name: '准确率 (%)' },
    series: [{
      name: '准确率', type: 'bar', barWidth: '50%',
      data: [
        { value: treeAccuracy.value, itemStyle: { color: '#67c23a' } },
        { value: perceptronAccuracy.value, itemStyle: { color: '#e6a23c' } }
      ],
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 16 }
    }]
  };
  myChart.setOption(option);
};
</script>

<style scoped>
.compare-page { background-color: #f5f7fa; min-height: 100vh; display: flex; flex-direction: row; position: relative; }
.main-content { flex: 1; display: flex; flex-direction: column; gap: 20px; padding: 20px; min-width: 0; }
.header { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 15px 25px; padding-right: 180px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); }
.header h2 { margin: 0; color: #303133; }

/* 按钮组 */
.actions { display: flex; align-items: center; gap: 15px; }
.help-group { display: flex; align-items: center; gap: 10px; }
.divider { width: 1px; height: 24px; background: #e0e0e0; }

.config-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; max-width: 560px; }
.config-item { display: flex; align-items: center; gap: 6px; }
.config-label { font-size: 12px; color: #909399; white-space: nowrap; }
.config-select { height: 30px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 0 8px; font-size: 12px; color: #303133; background: #fff; }
.dataset-badge { font-size: 12px; color: #303133; background: #f4f4f5; border: 1px solid #ebeef5; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
.dataset-badge.empty { color: #909399; }
.blockly-status { margin-top: 6px; font-size: 12px; color: #e6a23c; background: #fdf6ec; border: 1px solid #faecd8; padding: 4px 10px; border-radius: 6px; max-width: 280px; line-height: 1.35; }

.btn-help { background: rgba(64, 158, 255, 0.1); color: #409eff; border: 1px solid #a0cfff; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; }
.btn-help:hover { background: #409eff; color: white; }
.btn-help.secondary { background: #f4f4f5; color: #606266; border-color: #dcdfe6; }
.btn-help.secondary:hover { background: #e6e6e6; }

.btn-import { background: rgba(103, 194, 58, 0.1); color: #67c23a; border: 1px solid #e1f3d8; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; }
.btn-import:hover { background: #67c23a; color: white; }

.btn-run { background-color: #409eff; color: white; border: none; padding: 10px 25px; font-size: 16px; border-radius: 6px; cursor: pointer; transition: 0.3s; font-weight: bold; }
.btn-run:hover { background-color: #66b1ff; }
.btn-run:disabled { background-color: #a0cfff; cursor: not-allowed; }

.charts-area { display: flex; gap: 20px; }
.chart-card { flex: 2; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); }
.stats-card { flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center; gap: 20px; }
.stat-item { text-align: center; padding: 15px; border-radius: 8px; background: #f4f4f5; }
.stat-item.highlight-tree { background: #f0f9eb; color: #67c23a; }
.stat-item.highlight-pt { background: #fdf6ec; color: #e6a23c; }
.stat-item .label { display: block; font-size: 14px; color: #909399; margin-bottom: 5px; }
.stat-item .value { font-size: 28px; font-weight: bold; }

.logs-container { display: flex; gap: 20px; flex: 1; overflow: hidden; }
.log-box { flex: 1; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); display: flex; flex-direction: column; height: 500px; }
.log-header { padding: 15px; font-weight: bold; font-size: 16px; border-bottom: 1px solid #ebeef5; }
.tree-box .log-header { border-left: 5px solid #67c23a; color: #67c23a; }
.pt-box .log-header { border-left: 5px solid #e6a23c; color: #e6a23c; }
.log-content { flex: 1; overflow-y: auto; padding: 0; }
.log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.log-table th { background: #fafafa; position: sticky; top: 0; padding: 10px; text-align: center; color: #909399; border-bottom: 1px solid #ebeef5; }
.log-table td { padding: 8px; text-align: center; border-bottom: 1px solid #ebeef5; color: #606266; }
.badge-success { color: #67c23a; font-weight: bold; font-size: 16px; }
.badge-fail { color: #f56c6c; font-weight: bold; font-size: 16px; }

.introduce-wrapper { 
  display: flex; 
  flex-direction: column; 
  flex-shrink: 0; 
  overflow: visible;
  position: relative;
  min-width: 0;
  border-left: 1px solid #ddd;
}
.compare-page :deep(.introduce-container) { 
  position: static !important; 
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.compare-page :deep(.introduce-box) {
  position: static !important;
  height: 100% !important;
  min-height: 100% !important;
  transform: none !important;
  width: auto !important;
  transition: width 0.2s;
  flex-shrink: 0;
}
.compare-page :deep(.introduce-box.introduce-hidden) {
  width: 0 !important;
  min-width: 0 !important;
  overflow: hidden;
  border: none;
  padding: 0;
  margin: 0;
}
.compare-page :deep(.introduce-header),
.compare-page :deep(.content) {
  transition: width 0.2s, opacity 0.2s;
}
.compare-page :deep(.introduce-box.introduce-hidden .introduce-header),
.compare-page :deep(.introduce-box.introduce-hidden .content) {
  opacity: 0;
  width: 0 !important;
}
.compare-page :deep(.open-btn-box) {
  position: fixed !important;
  right: 20px;
  top: 10px;
  z-index: 101;
}
</style>
