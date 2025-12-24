<template>
  <div class="tree-studio">
    <header class="toolbar">
      <div class="brand">🌳 智能决策树构建器</div>
    </header>

    <div class="action-bar" id="guide-action-bar">
      <div class="left-group">
        <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileImport" />
        <button class="btn-import" @click="triggerFileInput">📁 导入CSV</button>
        <button class="btn-help" @click="startGuide">❓ 引导指引</button>
      </div>

      <div class="right-group">
        <button @click="resetTree">🔄 重置画布</button>

      </div>
    </div>

    <div class="workspace">
      <div class="canvas-area" id="guide-canvas">
        <div ref="chartContainer" class="echarts-container"></div>
        <div v-if="isTraining" class="loading">正在寻找最佳分割点...</div>
        <div class="instruction-toast">
          🖱️ <b>滚轮</b> 缩放 | <b>拖拽</b> 漫游 | <b>悬停</b> 查看节点/分支信息
        </div>
      </div>

      <aside class="sidebar" id="guide-result">
        <div class="panel result-panel">
          <div class="panel-header">
            <h3>📊 分析结果</h3>
            <span v-if="results.length" class="badge">{{ results.length }} 条</span>
          </div>

          <div class="panel-body">
            <div v-if="csvHeaders.length" class="train-panel">
              <div class="train-title">自动生成决策树</div>
              <div class="form-item">
                <label>预测目标 (Target):</label>
                <select v-model="targetCol" class="full-width">
                  <option v-for="header in csvHeaders" :key="header" :value="header">{{ header }}</option>
                </select>
              </div>
              <label class="train-checkbox">
                <input type="checkbox" v-model="autoFilter" style="width:auto; margin-bottom:0; margin-right:6px;">
                自动过滤ID列
              </label>
              <button class="btn-primary full-width" @click="trainFromCsv" :disabled="isTraining">
                {{ isTraining ? '正在生成...' : '生成决策树' }}
              </button>
              <div v-if="trainedFeatures.length" class="train-tip">已选择特征：{{ trainedFeatures.length }} 个</div>
            </div>

            <div v-if="csvRows.length" class="train-panel">
              <div class="train-title">CSV 数据列表（点击一条高亮路径）</div>
              <div class="csv-meta">
                <span>共 {{ csvRows.length }} 条</span>
                <button
                  v-if="csvRows.length > MAX_CSV_LIST_ROWS"
                  class="btn-link"
                  type="button"
                  @click="showAllCsvRows = !showAllCsvRows"
                >
                  {{ showAllCsvRows ? '收起' : ('显示全部(' + csvRows.length + ')') }}
                </button>
              </div>

              <div class="csv-list">
                <button
                  v-for="(row, idx) in displayedCsvRows"
                  :key="idx"
                  type="button"
                  class="csv-row-item"
                  :class="{ active: idx === selectedCsvRowIndex }"
                  @click="selectCsvRow(row, idx)"
                >
                  <span class="csv-row-index">#{{ idx + 1 }}</span>
                  <span class="csv-row-id">{{ getCsvRowDisplayId(row, idx) }}</span>
                  <span class="csv-row-preview">{{ getCsvRowPreview(row) }}</span>
                </button>
              </div>
            </div>

            <div v-if="predictionFields.length" class="train-panel">
              <div class="train-title">预测演示</div>
              <div class="prediction-inputs">
                <div v-for="field in predictionFields" :key="field.feature" class="pred-row">
                  <label class="pred-label">{{ field.feature }}</label>
                  <input
                    v-if="field.type === 'number'"
                    type="number"
                    step="0.1"
                    class="full-width"
                    v-model="predictionValues[field.feature]"
                    placeholder="输入数字"
                  />
                  <select v-else-if="field.type === 'select'" class="full-width" v-model="predictionValues[field.feature]">
                    <option v-for="opt in field.options" :key="String(opt)" :value="opt">{{ opt }}</option>
                  </select>
                  <input v-else type="text" class="full-width" v-model="predictionValues[field.feature]" placeholder="输入文本" />
                </div>
              </div>
              <button class="btn-primary full-width" @click="runPrediction">开始预测</button>
              <div v-if="predictionLogs.length" class="path-log">
                <div v-for="(line, idx) in predictionLogs" :key="idx">{{ line }}</div>
              </div>
            </div>
            <div v-if="results.length === 0" class="empty-state">
              <p>1. 点击上方"导入CSV"按钮上传CSV文件</p>
              <p>2. 构建决策树</p>
              <p>3. 点击右侧“CSV 数据列表”逐条高亮路径</p>
              <p class="sub-tip" v-if="csvHeaders.length > 0">✅ 已成功读取到 {{ csvHeaders.length }} 个列名</p>
            </div>
            <div v-else class="result-list">
              <div v-for="(item, idx) in results" :key="idx" class="result-card">
                <div class="card-title">
                  <span class="id-tag">#{{ item.id }}</span>
                  <span class="final-result" :class="getResultClass(item.result)">
                    {{ item.result }}
                  </span>
                </div>
                <div class="trace-path">
                  <div v-for="(step, sIdx) in item.path" :key="sIdx" class="step-item">
                    <span class="step-condition">{{ step.condition }}</span>
                    <span class="step-arrow">➔</span>
                    <span class="step-node">{{ step.node }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="introduce-wrapper" ref="introWrapper">
        <Introduce :path="'/tool-introduce/decision-tree-h5/guide.md'" />
      </div>
    </div>

    <div v-if="showModal" class="modal-mask" @click.self="closeModal">
      <div class="modal-box">
        <template v-if="editMode === 'node'">
          <h3>✏️ 编辑节点</h3>
          <div class="form-item radio-group">
            <label>节点类型：</label>
            <div class="radios">
              <label><input type="radio" v-model="editingNode.isLeaf" :value="false"> 判断节点 (查数据)</label>
              <label><input type="radio" v-model="editingNode.isLeaf" :value="true"> 结果节点 (出结论)</label>
            </div>
          </div>
          <div class="form-item">
            <label v-if="!editingNode.isLeaf">选择判断列名 (读取自CSV):</label>
            <label v-else>填写分类结果:</label>
            <select v-if="!editingNode.isLeaf" v-model="editingNode.name" class="full-width">
              <option disabled value="">-- 请选择列名 --</option>
              <option v-for="header in csvHeaders" :key="header" :value="header">{{ header }}</option>
            </select>
            <input v-else v-model="editingNode.name" placeholder="例如：推荐骑车" class="full-width">
          </div>
          <div class="modal-actions">
            <div class="left">
              <button class="btn-add" @click="addChild" v-if="!editingNode.isLeaf">➕ 加子分支</button>
              <button class="btn-danger" v-if="editingNode.id !== treeData.id" @click="deleteNode">🗑️ 删除</button>
            </div>
            <div class="right">
              <button @click="closeModal">取消</button>
              <button class="btn-primary" @click="saveNode">确定保存</button>
            </div>
          </div>
        </template>

        <template v-if="editMode === 'condition'">
          <h3>🔗 编辑分支条件</h3>
          <p class="modal-tip">修改通往 <b>"{{ targetNodeName }}"</b> 的判断逻辑</p>
          <div class="form-item">
            <label>当满足以下条件时，进入该分支：</label>
            <div class="condition-input-group">
              <select v-model="editingCondition.operator">
                <option value="==">等于 (==)</option><option value="!=">不等于 (!=)</option>
                <option value=">">大于 (&gt;)</option><option value="<">小于 (&lt;)</option>
                <option value=">=">大于等于 (&ge;)</option><option value="<=">小于等于 (&le;)</option>
              </select>
              <input v-model="editingCondition.conditionValue" placeholder="值 (如: 晴 / 2)">
            </div>
          </div>
          <div class="modal-actions">
            <div class="left"></div>
            <div class="right">
              <button @click="closeModal">取消</button>
              <button class="btn-primary" @click="saveCondition">保存条件</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import GraphView from 'echarts/lib/chart/graph/GraphView.js';
import { getNodeGlobalScale } from 'echarts/lib/chart/graph/graphHelper.js';
import Line from 'echarts/lib/chart/helper/Line.js';
import guide from '@/utils/guide';
import Introduce from '@/components/Introduce.vue';
import { AdvancedDecisionTree } from '@/utils/decisionTreeAlgorithm.js';

const chartContainer = ref(null);
const introWrapper = ref(null); // 侧边栏 wrapper ref
let myChart = null;
let resizeObserver = null;

let graphEdgeEllipsePatchInstalled = false;

const installGraphEdgeEllipsePatch = () => {
  if (graphEdgeEllipsePatchInstalled) return;
  graphEdgeEllipsePatchInstalled = true;

  if (Line?.prototype && !Line.prototype.__jinshanHorizontalEdgeLabelPatched) {
    Line.prototype.__jinshanHorizontalEdgeLabelPatched = true;
    const originalBeforeUpdate = Line.prototype.beforeUpdate;
    Line.prototype.beforeUpdate = function (...args) {
      if (typeof originalBeforeUpdate === 'function') {
        originalBeforeUpdate.apply(this, args);
      }
      if (this?.__jinshanKeepLabelHorizontal) {
        const label = this.getTextContent?.();
        if (label && !label.ignore) label.rotation = 0;
      }
    };
  }

  if (GraphView?.prototype?.__jinshanEllipseEdgePatched) return;
  if (GraphView?.prototype) GraphView.prototype.__jinshanEllipseEdgePatched = true;

  const clampToFinitePositive = (num, fallback = 0) => {
    const n = Number(num);
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return n;
  };

  const computeEllipseRadius = (symbolSize, dirX, dirY) => {
    if (!Array.isArray(symbolSize)) {
      const size = clampToFinitePositive(symbolSize);
      return size / 2;
    }

    const w = clampToFinitePositive(symbolSize[0]);
    const h = clampToFinitePositive(symbolSize[1]);
    const a = w / 2;
    const b = h / 2;
    if (!a || !b) return (a + b) / 2;

    const denom = (dirX * dirX) / (a * a) + (dirY * dirY) / (b * b);
    if (!Number.isFinite(denom) || denom <= 0) return (a + b) / 2;
    return 1 / Math.sqrt(denom);
  };

  const applyEllipseEdgeFix = (seriesModel, view, api) => {
    if (!seriesModel || seriesModel.type !== 'series.graph') return;
    if (seriesModel?.option?.id !== 'decision-tree-h5-graph') return;
    const graph = seriesModel.getGraph?.();
    if (!graph) return;

    const nodeScale = getNodeGlobalScale(seriesModel);
    const linePathEls = [];

    graph.eachEdge((edge) => {
      const edgeEl = edge?.getGraphicEl?.();
      if (edgeEl) {
        edgeEl.__jinshanKeepLabelHorizontal = true;
        const linePath = edgeEl.childOfName?.('line');
        if (linePath) linePathEls.push(linePath);
      }

      const linePoints = edge?.getLayout?.();
      if (!linePoints || !linePoints[0] || !linePoints[1]) return;
      if (linePoints[2] != null) return; // 仅处理直线（当前决策树使用直线）

      const from = edge.node1?.getLayout?.();
      const to = edge.node2?.getLayout?.();
      if (!from || !to) return;

      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      const len = Math.hypot(dx, dy);
      if (!Number.isFinite(len) || len <= 0) return;

      const ux = dx / len;
      const uy = dy / len;

      const size1 = edge.node1?.getVisual?.('symbolSize');
      const size2 = edge.node2?.getVisual?.('symbolSize');

      let offset1 = computeEllipseRadius(size1, ux, uy) * nodeScale;
      let offset2 = computeEllipseRadius(size2, ux, uy) * nodeScale;
      if (!Number.isFinite(offset1)) offset1 = 0;
      if (!Number.isFinite(offset2)) offset2 = 0;

      // 防止节点过近导致线段翻折
      const maxOffset = Math.max(0, (len - 1) / 2);
      offset1 = Math.min(offset1, maxOffset);
      offset2 = Math.min(offset2, maxOffset);

      linePoints[0][0] = from[0] + ux * offset1;
      linePoints[0][1] = from[1] + uy * offset1;
      linePoints[1][0] = to[0] - ux * offset2;
      linePoints[1][1] = to[1] - uy * offset2;
    });

    view?._lineDraw?.updateLayout?.();
    // 防止更新动画把我们修正后的端点“拉回去”，导致点击高亮时线/文字上下跳动
    linePathEls.forEach((el) => {
      try {
        el.stopAnimation?.('update');
      } catch (_) {
        // ignore
      }
    });
  };

  const wrapAfter = (proto, methodName, after) => {
    const original = proto[methodName];
    if (typeof original !== 'function') return;

    proto[methodName] = function (...args) {
      const result = original.apply(this, args);
      try {
        after.call(this, ...args);
      } catch (_) {
        // ignore
      }
      return result;
    };
  };

  wrapAfter(GraphView.prototype, 'render', function (seriesModel, ecModel, api) {
    applyEllipseEdgeFix(seriesModel, this, api);
  });

  wrapAfter(GraphView.prototype, 'updateLayout', function (seriesModel) {
    applyEllipseEdgeFix(seriesModel, this);
  });

  wrapAfter(GraphView.prototype, 'updateViewOnZoom', function (seriesModel, api, params) {
    applyEllipseEdgeFix(seriesModel, this, api);
  });
};

const showModal = ref(false);
const editMode = ref('node');
const editingNode = ref({});
const editingCondition = ref({});
const targetNodeName = ref('');

const results = ref([]);
const csvHeaders = ref([]);
const csvRows = ref([]);
const fileInput = ref(null);
const selectedCsvRowIndex = ref(-1);
const showAllCsvRows = ref(false);

const MAX_CSV_LIST_ROWS = 200;
const displayedCsvRows = computed(() => {
  if (showAllCsvRows.value) return csvRows.value;
  return csvRows.value.slice(0, MAX_CSV_LIST_ROWS);
});

const targetCol = ref('');
const autoFilter = ref(true);
const isTraining = ref(false);
const trainedFeatures = ref([]);
const predictionFields = ref([]);
const predictionValues = ref({});
const predictionLogs = ref([]);
const highlightedPathIds = ref([]);

const PLACEHOLDER_ROOT_NAME = '请导入CSV\n并生成决策树';
const createEmptyTree = (rootName = PLACEHOLDER_ROOT_NAME) => ({
  id: 'root',
  name: rootName,
  isLeaf: false,
  children: []
});

const treeData = ref(createEmptyTree());

// 数据转换逻辑 (保持不变)
const transformToVisualData = (node) => {
  const visualNode = {
    name: node.name,
    originalData: node,
    isRealNode: true,
    symbol: 'rect',
    symbolSize: [140, 45],
    itemStyle: {
      color: '#fff', borderColor: '#409eff', borderWidth: 1.5,
      borderRadius: 6, shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.1)'
    },
    label: {
      show: true, position: 'inside',
      formatter: (params) => {
        let name = params.name;
        if (name.length > 8) name = name.substring(0, 8) + '...';
        return node.isLeaf ? `🏁 ${name}` : name;
      },
      fontSize: 13, color: '#333', fontWeight: 'bold'
    },
    leaves: {
      label: { position: 'inside', verticalAlign: 'middle', align: 'center' },
      itemStyle: { color: '#f0f9eb', borderColor: '#67c23a' }
    },
    children: []
  };

  if (node.isLeaf) {
    visualNode.itemStyle = { color: '#f0f9eb', borderColor: '#67c23a', borderWidth: 1.5, borderRadius: 6 };
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const conditionLabel = `${child.operator} ${child.conditionValue}`;
      const phantomNode = {
        name: conditionLabel,
        isConditionNode: true,
        targetChildId: child.id,
        symbol: 'rect',
        symbolSize: [80, 26],
        itemStyle: {
          color: '#ecf5ff', borderColor: '#409eff', borderWidth: 1, borderRadius: 12
        },
        label: {
          show: true, position: 'inside', color: '#409eff', fontSize: 12, fontWeight: 'bold'
        },
        children: [transformToVisualData(child)]
      };
      visualNode.children.push(phantomNode);
    });
  }
  return visualNode;
};

const ensureIds = (node) => {
  if (!node.id) node.id = 'node_' + Math.random().toString(36).substr(2, 9);
  if (node.children) node.children.forEach(child => ensureIds(child));
};
const findNodeById = (node, id) => {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
};

onMounted(async () => {
  installGraphEdgeEllipsePatch();
  ensureIds(treeData.value);
  initChart();

  // 1. 监听容器大小 (处理窗口拖拽)
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      if (myChart) myChart.resize();
    });
    resizeObserver.observe(chartContainer.value);
  }

  // 2. 监听侧边栏动画结束 (处理展开收起)
  if (introWrapper.value) {
    introWrapper.value.addEventListener('transitionend', () => {
      if (myChart) myChart.resize();
    });
  }

  nextTick(() => { startGuide(); });
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (myChart) myChart.dispose();
});

const startGuide = () => {
  const steps = [
    {
      element: '#guide-action-bar',
      popover: {
        title: '🛠️ 第一步：操作栏',
        description: '在这里 <b>导入CSV数据</b>，生成决策树。',
        side: "bottom", align: 'start'
      }
    },
    {
      element: '#guide-canvas',
      popover: {
        title: '🎨 第二步：构建决策树',
        description: '生成决策树后可 <b>拖拽/缩放</b> 查看结构，分支条件显示在连线标签上；悬停可查看更多信息。',
        side: "right", align: 'center'
      }
    },
    {
      element: '#guide-result',
      popover: {
        title: '📊 第三步：查看结果',
        description: '分析完成后，这里会显示每一行数据的分类结果及判定路径。',
        side: "left", align: 'start'
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
  const cleanText = text.replace(/^\ufeff/, '');
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
    csvHeaders.value = headers;
    csvRows.value = rows;
    targetCol.value = headers[headers.length - 1] || '';
    treeData.value = createEmptyTree(headers.length ? 'CSV已导入\n点击生成决策树' : PLACEHOLDER_ROOT_NAME);
    results.value = [];
    trainedFeatures.value = [];
    predictionFields.value = [];
    predictionValues.value = {};
    predictionLogs.value = [];
    highlightedPathIds.value = [];
    selectedCsvRowIndex.value = -1;
    showAllCsvRows.value = false;
    renderTree();
    alert('CSV文件导入成功！');
  } catch (e) {
    alert('CSV文件读取失败');
  }
  event.target.value = '';
};

const buildEdgeLabel = (childNode) => {
  const op = String(childNode.operator ?? '').trim();
  const rawVal = childNode.conditionValue;

  let val = '';
  if (typeof rawVal === 'number' && Number.isFinite(rawVal)) {
    val = String(parseFloat(rawVal.toFixed(2)));
  } else {
    val = String(rawVal ?? '').trim();
  }

  if (!op && !val) return String(childNode.condition ?? '').trim();

  const displayOp = op === '==' ? '=' : op;
  return `${displayOp} ${val}`.trim();
};

const buildGraphNodeLabel = (node) => {
  const hasStats = typeof node.samples === 'number' && node.counts && Object.keys(node.counts).length > 0;
  if (!hasStats) return node.name;

  const total = node.samples || 0;
  const statsList = Object.entries(node.counts).map(([k, v]) => {
    const percent = total ? Math.round((v / total) * 100) : 0;
    return `${k}: ${v} (${percent}%)`;
  });
  const statsStr = statsList.join('\n');

  const labelParts = [];
  labelParts.push(node.isLeaf ? `{leafTitle|结果: ${node.name}}` : `{title|${node.name}}`);
  labelParts.push(`{hr|}`);
  labelParts.push(`{grayLabel|样本总数: ${node.samples}}`);
  labelParts.push(`{grayLabel|分布 (数量/概率):}`);
  labelParts.push(`{stats|${statsStr}}`);
  return labelParts.join('\n');
};

const buildGraphNodeStyle = (node, highlightSet) => {
  const hasStats = typeof node.samples === 'number' && node.counts && Object.keys(node.counts).length > 0;
  const statsCount = hasStats ? Object.keys(node.counts || {}).length : 0;

  const baseWidth = hasStats ? 220 : 160;
  const baseHeight = hasStats ? (118 + (statsCount * 16)) : 60;
  const symbolSize = [baseWidth, baseHeight];
  // 椭圆节点边缘更“圆”，内容需要更大的左右留白，避免文字贴边/溢出
  const richWidth = baseWidth - 60;

  const nodeColor = node.isLeaf ? '#f6ffed' : '#fff';
  const borderColor = node.isLeaf ? '#52c41a' : '#409eff';

  const itemStyle = {
    color: nodeColor,
    borderColor,
    borderWidth: 1.5
  };

  const label = {
    show: true,
    position: 'inside',
    padding: hasStats ? [10, 18] : [8, 10],
    formatter: (params) => params.data.name
  };

  if (!hasStats) {
    label.color = '#333';
    label.fontSize = 13;
    label.fontWeight = 'bold';
    label.align = 'center';
    label.verticalAlign = 'middle';
  } else {
    label.rich = {
      title: { fontSize: 13, fontWeight: 'bold', padding: [2, 0], color: "#000", align: 'center', width: richWidth },
      leafTitle: { fontSize: 14, fontWeight: 'bold', padding: [2, 0], color: "#389e0d", align: 'center', width: richWidth },
      hr: { borderColor: '#e8e8e8', width: richWidth, borderWidth: 1, height: 0, margin: [4, 0] },
      grayLabel: { fontSize: 10, color: "#888", padding: [1, 0], align: 'center', width: richWidth },
      stats: { fontSize: 11, color: "#333", padding: [1, 0], align: 'center', lineHeight: 14, width: richWidth }
    };
  }

  if (highlightSet.size > 0) {
    if (highlightSet.has(node.id)) {
      Object.assign(itemStyle, {
        color: '#fffbe6',
        borderColor: '#faad14',
        borderWidth: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(250, 173, 20, 0.5)'
      });
    } else {
      itemStyle.opacity = 0.25;
      label.opacity = 0.25;
    }
  }

  return { itemStyle, label, symbolSize };
};

// 椭圆节点（使用 path，避免 circle 只能画正圆）
const ELLIPSE_SYMBOL_PATH = 'path://M50 0 C77.614 0 100 11.193 100 25 C100 38.807 77.614 50 50 50 C22.386 50 0 38.807 0 25 C0 11.193 22.386 0 50 0 Z';

const buildGraphData = (root, highlightPath = []) => {
  const nodes = [];
  const links = [];
  const depthMap = {};
  const highlightSet = new Set(highlightPath);

  const ySpacing = 180;

  const visit = (node, parentId = null, depth = 0) => {
    const labelText = buildGraphNodeLabel(node);
    const { itemStyle, label, symbolSize } = buildGraphNodeStyle(node, highlightSet);

    const graphNode = {
      id: node.id,
      name: labelText,
      x: 0,
      y: depth * ySpacing,
      symbol: ELLIPSE_SYMBOL_PATH,
      symbolKeepAspect: false,
      symbolSize,
      itemStyle,
      label,
      dataInfo: {
        id: node.id,
        name: node.name,
        isLeaf: !!node.isLeaf,
        samples: node.samples,
        counts: node.counts
      }
    };

    nodes.push(graphNode);
    if (!depthMap[depth]) depthMap[depth] = [];
    depthMap[depth].push(graphNode);

    if (parentId !== null) {
      const sourceInPath = highlightSet.has(parentId);
      const targetInPath = highlightSet.has(node.id);
      const inPath = highlightSet.size > 0 && sourceInPath && targetInPath;

      const baseLabel = {
        show: true,
        formatter: buildEdgeLabel(node),
        fontSize: 11,
        fontWeight: 'bold',
        color: '#d48806',
        backgroundColor: '#fffbe6',
        padding: [3, 6],
        borderRadius: 3,
        borderColor: '#ffe58f',
        borderWidth: 1
      };

      const link = {
        source: parentId,
        target: node.id,
        label: baseLabel,
        lineStyle: {
          color: '#aaa',
          width: 2,
          curveness: 0
        }
      };

      if (highlightSet.size > 0) {
        if (inPath) {
          link.lineStyle = { color: '#faad14', width: 4, curveness: 0 };
          link.label = Object.assign({}, baseLabel, {
            backgroundColor: '#fff7e6',
            borderColor: '#faad14',
            color: '#d48806',
            fontWeight: 'bold'
          });
        } else {
          link.lineStyle = Object.assign({}, link.lineStyle, { opacity: 0.2 });
          link.label = Object.assign({}, baseLabel, { opacity: 0.2 });
        }
      }

      links.push(link);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => visit(child, node.id, depth + 1));
    }
  };

  visit(root);

  const chartWidth = chartContainer.value?.clientWidth || 1200;
  Object.keys(depthMap).forEach(depth => {
    const nodesAtDepth = depthMap[depth];
    const spacing = chartWidth / (nodesAtDepth.length + 1);
    nodesAtDepth.forEach((n, i) => { n.x = spacing * (i + 1); });
  });

  return { nodes, links };
};

const initChart = () => {
  if (!chartContainer.value) return;
  myChart = echarts.init(chartContainer.value);
  renderTree();
};

const renderTree = () => {
  if (!myChart) return;
  const { nodes, links } = buildGraphData(treeData.value, highlightedPathIds.value);

  myChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'edge') {
          const edgeLabel = params.data?.label?.formatter || '';
          return `<div style="padding:5px;"><strong>分支条件</strong><br/>${edgeLabel}</div>`;
        }

        const info = params.data?.dataInfo;
        if (!info) return '';

        let html = `<div style="padding:5px;">`;
        html += info.isLeaf ? `<strong>叶子节点</strong><br/>结果: <b>${info.name}</b><br/>` : `<strong>决策节点</strong><br/>`;

        if (typeof info.samples === 'number' && info.counts) {
          html += `<hr style="margin:5px 0; border:0; border-top:1px solid #ddd;"/>`;
          html += `样本数: <strong>${info.samples}</strong><br/>`;
          for (let k in info.counts) {
            const count = info.counts[k];
            const pct = info.samples ? Math.round((count / info.samples) * 100) : 0;
            html += `${k}: ${count} (${pct}%)<br/>`;
          }
        }

        html += `</div>`;
        return html;
      }
    },
    series: [{
      type: 'graph',
      id: 'decision-tree-h5-graph',
      layout: 'none',
      data: nodes,
      links: links,
      roam: true,
      draggable: true,
      edgeLabel: { show: true, position: 'middle', fontSize: 11 },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 8],
      lineStyle: { opacity: 0.9, width: 2, curveness: 0 }
    }]
  }, false);
};

const openNodeModal = (realNode) => {
  editingNode.value = JSON.parse(JSON.stringify(realNode));
  if (editingNode.value.isLeaf === undefined) {
    const hasChildren = editingNode.value.children && editingNode.value.children.length > 0;
    editingNode.value.isLeaf = !hasChildren;
  }
  editMode.value = 'node';
  showModal.value = true;
};

const openConditionModal = (edgeData) => {
  const realChildId = edgeData?.target;
  if (!realChildId) return;
  const realChildNode = findNodeById(treeData.value, realChildId);
  if (realChildNode) {
    editingCondition.value = {
      id: realChildNode.id,
      operator: realChildNode.operator,
      conditionValue: realChildNode.conditionValue
    };
    targetNodeName.value = realChildNode.name;
    editMode.value = 'condition';
    showModal.value = true;
  }
};

const closeModal = () => { showModal.value = false; };

const saveNode = () => {
  const realNode = findNodeById(treeData.value, editingNode.value.id);
  if (realNode) {
    realNode.name = editingNode.value.name;
    realNode.isLeaf = editingNode.value.isLeaf;
  }
  renderTree();
  closeModal();
};

const saveCondition = () => {
  const realNode = findNodeById(treeData.value, editingCondition.value.id);
  if (realNode) {
    realNode.operator = editingCondition.value.operator;
    realNode.conditionValue = editingCondition.value.conditionValue;
    delete realNode.condition;
  }
  renderTree();
  closeModal();
};

const addChild = () => {
  const realNode = findNodeById(treeData.value, editingNode.value.id);
  if (!realNode) return;
  if (!realNode.children) realNode.children = [];
  const newNode = {
    id: 'node_' + Math.random().toString(36).substr(2, 9),
    name: "新结论",
    isLeaf: true,
    operator: "==", conditionValue: "值"
  };
  realNode.children.push(newNode);
  if (!editingNode.value.children) editingNode.value.children = [];
  editingNode.value.children.push(newNode);
  treeData.value = {...treeData.value};
  renderTree();
};

const deleteNode = () => {
  if (editingNode.value.id === treeData.value.id) { alert("不可删除根节点"); return; }
  const remove = (parent, targetId) => {
    if (!parent.children) return false;
    const idx = parent.children.findIndex(n => n.id === targetId);
    if (idx > -1) { parent.children.splice(idx, 1); return true; }
    for (const child of parent.children) { if (remove(child, targetId)) return true; }
    return false;
  };
  remove(treeData.value, editingNode.value.id);
  treeData.value = {...treeData.value};
  renderTree();
  closeModal();
};

const resetTree = () => {
  const rootName = csvHeaders.value.length > 0 ? 'CSV已导入\n点击生成决策树' : PLACEHOLDER_ROOT_NAME;
  treeData.value = createEmptyTree(rootName);
  results.value = [];
  trainedFeatures.value = [];
  predictionFields.value = [];
  predictionValues.value = {};
  predictionLogs.value = [];
  highlightedPathIds.value = [];
  selectedCsvRowIndex.value = -1;
  renderTree();
};

const traverse = (node, row, path = []) => {
  if (node.isLeaf) return {result: node.name, path};
  const colName = node.name.trim();
  const rowValue = row[colName];
  if (rowValue === undefined) return {result: `未知列: ${colName}`, path};
  if (node.children) {
    for (const child of node.children) {
      const op = child.operator;
      let targetVal = child.conditionValue === null || child.conditionValue === undefined ? '' : String(child.conditionValue).trim();
      if ((targetVal.startsWith("'") && targetVal.endsWith("'")) || (targetVal.startsWith('"') && targetVal.endsWith('"'))) targetVal = targetVal.slice(1, -1);
      let compareVal = targetVal;
      if (typeof rowValue === 'number') {
        const parsed = parseFloat(targetVal);
        if (!isNaN(parsed)) compareVal = parsed;
      }
      let match = false;
      switch (op) {
        case '==': match = (rowValue == compareVal); break;
        case '!=': match = (rowValue != compareVal); break;
        case '>': match = (rowValue > compareVal); break;
        case '<': match = (rowValue < compareVal); break;
        case '>=': match = (rowValue >= compareVal); break;
        case '<=': match = (rowValue <= compareVal); break;
      }
      if (match) {
        const stepDesc = {condition: `${colName}(${rowValue}) ${op} ${compareVal}`, node: child.name};
        return traverse(child, row, [...path, stepDesc]);
      }
    }
  }
  return {result: "无匹配分支", path: [...path, {condition: `${colName}(${rowValue})`, node: "❌"}]};
};

const toIdLikeString = (val) => {
  if (val === null || val === undefined) return '';
  return typeof val === 'string' ? val : String(val);
};

const formatPercent = (prob) => {
  if (typeof prob !== 'number' || !Number.isFinite(prob)) return '--';
  return `${Math.round(prob * 100)}%`;
};

const getMostProbableClass = (node) => {
  if (!node || typeof node.samples !== 'number' || node.samples <= 0) return null;
  const counts = node.counts;
  if (!counts) return null;
  let bestLabel = null;
  let bestCount = -1;
  for (const [label, count] of Object.entries(counts)) {
    if (typeof count !== 'number') continue;
    if (count > bestCount) {
      bestCount = count;
      bestLabel = label;
    }
  }
  if (bestLabel === null || bestCount < 0) return null;
  return { label: bestLabel, count: bestCount, prob: bestCount / node.samples };
};

const getClassProbAtNode = (node, classLabel) => {
  if (!node || typeof node.samples !== 'number' || node.samples <= 0) return null;
  const counts = node.counts;
  if (!counts) return null;
  const count = counts[classLabel];
  if (typeof count !== 'number') return { count: 0, prob: 0 };
  return { count, prob: count / node.samples };
};

const formatValueForLog = (val) => {
  if (typeof val === 'number' && Number.isFinite(val)) return String(parseFloat(val.toFixed(4)));
  if (val === null || val === undefined) return '';
  return String(val);
};

const getCsvRowDisplayId = (row, idx) => {
  const candidate = row?.['学生ID'] ?? row?.['ID'] ?? row?.['id'] ?? row?.['Id'] ?? row?.['学号'];
  const id = toIdLikeString(candidate);
  return id ? `ID: ${id}` : `Row ${idx + 1}`;
};

const getCsvRowPreview = (row) => {
  const cols = trainedFeatures.value.length ? trainedFeatures.value : csvHeaders.value;
  const previewCols = cols.slice(0, 3);
  if (previewCols.length === 0) return '';
  return previewCols
    .map(col => `${col}=${formatValueForLog(row?.[col])}`)
    .join('  ');
};

const predictTrace = (root, inputRow) => {
  let curr = root;
  const pathIds = [curr.id];
  const pathNodes = [curr];
  const decisions = [];

  while (curr && !curr.isLeaf) {
    const colName = (curr.name || '').trim();
    const rowValue = inputRow[colName];

    if (rowValue === undefined) {
      const result = `未知列: ${colName}`;
      return { result, pathIds, logs: [result] };
    }

    let next = null;
    let compareValForLog = '';

    if (curr.children) {
      for (const child of curr.children) {
        const op = child.operator;
        let targetVal = child.conditionValue === null || child.conditionValue === undefined ? '' : String(child.conditionValue).trim();
        if ((targetVal.startsWith("'") && targetVal.endsWith("'")) || (targetVal.startsWith('"') && targetVal.endsWith('"'))) {
          targetVal = targetVal.slice(1, -1);
        }

        let compareVal = targetVal;
        if (typeof rowValue === 'number') {
          const parsed = parseFloat(targetVal);
          if (!isNaN(parsed)) compareVal = parsed;
        } else {
          const rowNum = Number(String(rowValue).trim());
          const targetNum = Number(targetVal);
          if (!Number.isNaN(rowNum) && !Number.isNaN(targetNum)) {
            compareVal = targetNum;
          }
        }

        let match = false;
        switch (op) {
          case '==': match = (rowValue == compareVal); break;
          case '!=': match = (rowValue != compareVal); break;
          case '>': match = (rowValue > compareVal); break;
          case '<': match = (rowValue < compareVal); break;
          case '>=': match = (rowValue >= compareVal); break;
          case '<=': match = (rowValue <= compareVal); break;
        }

        if (match) {
          next = child;
          compareValForLog = compareVal;
          break;
        }
      }
    }

    if (!next) {
      const result = '无匹配分支';
      return { result, pathIds, logs: [`无匹配分支: [${colName}] = ${rowValue}`] };
    }

    let branchProb = null;
    if (typeof curr.samples === 'number' && curr.samples > 0 && typeof next.samples === 'number') {
      branchProb = next.samples / curr.samples;
    }

    decisions.push({
      colName,
      rowValue: formatValueForLog(rowValue),
      operator: next.operator,
      compareVal: formatValueForLog(compareValForLog),
      nextNode: next,
      branchProb
    });

    pathIds.push(next.id);
    pathNodes.push(next);
    curr = next;
  }

  const leafMost = getMostProbableClass(curr);
  const result = String((curr?.isLeaf ? curr?.name : leafMost?.label) ?? '');

  const logs = [];
  const rootProbInfo = getClassProbAtNode(pathNodes[0], result);
  if (rootProbInfo) {
    logs.push(`根节点：P(结果=${result}) = ${formatPercent(rootProbInfo.prob)} (${rootProbInfo.count}/${pathNodes[0].samples})`);
  }

  decisions.forEach((step, idx) => {
    const nextNode = step.nextNode;
    const nextProbInfo = getClassProbAtNode(nextNode, result);
    const nodeName = nextNode.isLeaf ? `叶子(结果: ${nextNode.name})` : `节点(${nextNode.name})`;
    const branchText = step.branchProb === null ? '' : ` | 分支占比: ${formatPercent(step.branchProb)} (${nextNode.samples}/${pathNodes[idx].samples})`;
    const probText = nextProbInfo ? ` | P(结果=${result}) = ${formatPercent(nextProbInfo.prob)} (${nextProbInfo.count}/${nextNode.samples})` : '';
    logs.push(`判断: [${step.colName}] ${step.rowValue} ${step.operator} ${step.compareVal} -> 进入 ${nodeName}${branchText}${probText}`);
  });

  const leafProbInfo = getClassProbAtNode(curr, result);
  if (leafProbInfo) {
    logs.push(`最终预测: ${result} | 概率: ${formatPercent(leafProbInfo.prob)} (${leafProbInfo.count}/${curr.samples})`);
  } else {
    logs.push(`最终预测: ${result}`);
  }

  return { result, pathIds, logs };
};

const trainFromCsv = async () => {
  if (!csvRows.value || csvRows.value.length === 0) {
    alert('请先导入CSV文件');
    return;
  }
  if (!targetCol.value) {
    alert('请选择预测目标列');
    return;
  }

  isTraining.value = true;
  results.value = [];
  predictionLogs.value = [];
  highlightedPathIds.value = [];
  selectedCsvRowIndex.value = -1;

  await nextTick();

  try {
    const target = targetCol.value;
    const rowCount = csvRows.value.length;

    let features = csvHeaders.value.filter(h => h !== target);
    if (autoFilter.value) {
      features = features.filter(f => {
        const uniqueCount = new Set(csvRows.value.map(r => r[f])).size;
        const firstVal = csvRows.value[0]?.[f];
        const isString = typeof firstVal === 'string' && Number.isNaN(Number.parseFloat(firstVal));
        if (isString && uniqueCount > rowCount * 0.9) return false;
        if (f.toLowerCase().includes('id')) return false;
        return true;
      });
    }

    if (features.length === 0) {
      alert('可用特征列为空，请取消过滤或更换目标列');
      return;
    }

    const model = new AdvancedDecisionTree();
    const rawTree = model.fit(csvRows.value, target, features);

    const convert = (rawNode) => {
      const isLeaf = rawNode.type === 'leaf';
      const node = {
        id: rawNode.id,
        name: isLeaf ? rawNode.value : rawNode.feature,
        isLeaf,
        samples: rawNode.samples,
        counts: rawNode.counts,
        splitType: rawNode.splitType,
        threshold: rawNode.threshold,
        children: []
      };

      if (rawNode.children && rawNode.children.length > 0) {
        rawNode.children.forEach(childRaw => {
          const child = convert(childRaw);

          if (rawNode.splitType === 'numeric') {
            child.operator = childRaw.operator;
            child.conditionValue = typeof rawNode.threshold === 'number'
              ? rawNode.threshold
              : (rawNode.threshold ?? '');
          } else {
            child.operator = '==';
            child.conditionValue = String(childRaw.rawCondition ?? '');
          }

          child.condition = childRaw.condition;
          node.children.push(child);
        });
      }

      return node;
    };

    treeData.value = convert(rawTree);
    ensureIds(treeData.value);

    trainedFeatures.value = features;

    const fieldConfigs = features.map(f => {
      const isNum = model.isNumericColumn(csvRows.value, f);
      if (isNum) return { feature: f, type: 'number' };
      const uniqueVals = [...new Set(csvRows.value.map(r => r[f]))];
      if (uniqueVals.length < 15) return { feature: f, type: 'select', options: uniqueVals };
      return { feature: f, type: 'text' };
    });

    predictionFields.value = fieldConfigs;
    const defaults = {};
    fieldConfigs.forEach(f => {
      defaults[f.feature] = f.type === 'select' ? (f.options[0] ?? '') : '';
    });
    predictionValues.value = defaults;

    renderTree();
  } catch (e) {
    alert('生成决策树失败');
  } finally {
    isTraining.value = false;
  }
};

const runPrediction = () => {
  if (predictionFields.value.length === 0) {
    alert('请先生成决策树');
    return;
  }

  const inputRow = {};
  predictionFields.value.forEach(field => {
    const raw = predictionValues.value[field.feature];
    if (field.type === 'number') {
      const str = raw === null || raw === undefined ? '' : String(raw).trim();
      if (str === '') {
        inputRow[field.feature] = '';
        return;
      }
      const num = Number(str);
      inputRow[field.feature] = Number.isNaN(num) ? str : num;
      return;
    }
    inputRow[field.feature] = raw;
  });

  const outcome = predictTrace(treeData.value, inputRow);
  predictionLogs.value = outcome.logs;
  highlightedPathIds.value = outcome.pathIds;
  renderTree();
};

const selectCsvRow = (row, idx) => {
  if (typeof treeData.value?.samples !== 'number') {
    alert('请先生成决策树');
    return;
  }

  selectedCsvRowIndex.value = idx;

  // 同步到输入框，方便用户对照
  if (predictionFields.value.length) {
    const nextValues = { ...(predictionValues.value || {}) };
    predictionFields.value.forEach(field => {
      nextValues[field.feature] = row?.[field.feature];
    });
    predictionValues.value = nextValues;
  }

  const outcome = predictTrace(treeData.value, row || {});
  const header = `选中 CSV 行 #${idx + 1}（${getCsvRowDisplayId(row, idx)}）`;
  predictionLogs.value = [header, ...outcome.logs];
  highlightedPathIds.value = outcome.pathIds;
  renderTree();
};


const getResultClass = (text) => {
  if (!text) return '';
  if (text.includes('未知列')) return 'tag-danger';
  if (['骑车', '及格', 'Yes', '是', '推荐'].some(k => text.includes(k))) return 'tag-success';
  if (['不', 'Fail', '警告', '无', '步行'].some(k => text.includes(k))) return 'tag-danger';
  return 'tag-primary';
};
</script>

<style scoped>
.tree-studio { display: flex; flex-direction: column; height: 100vh; background: #f5f7fa; font-family: sans-serif; position: relative; }
.toolbar { height: 50px; background: #fff; border-bottom: 1px solid #eee; padding: 0 20px; display: flex; align-items: center; justify-content: flex-start; }
.brand { font-size: 18px; font-weight: bold; color: #333; }
.action-bar { height: 50px; background: #fff; border-bottom: 1px solid #ddd; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }
.left-group, .right-group { display: flex; gap: 10px; }
.action-bar button { padding: 6px 14px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.action-bar button:hover { border-color: #409eff; color: #409eff; }
.action-bar button.primary { background: #409eff; color: white; border: none; }
.action-bar button.primary:hover { background: #66b1ff; color: white; }
.btn-import { background: rgba(103, 194, 58, 0.1) !important; color: #67c23a !important; border-color: #e1f3d8 !important; }
.btn-import:hover { background: #67c23a !important; color: white !important; }
.btn-help { background: rgba(230, 162, 60, 0.1) !important; color: #e6a23c !important; border-color: #fcebc6 !important; }
.btn-help:hover { background: #e6a23c !important; color: white !important; }
.workspace { flex: 1; display: flex; overflow: hidden; }

/* 关键修改：添加 min-width: 0 防止 Flex 子元素溢出 */
.canvas-area { flex: 1; min-width: 0; position: relative; background: radial-gradient(#ddd 1px, transparent 1px) 0 0 / 20px 20px; }

.echarts-container { width: 100%; height: 100%; }
.loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 255, 255, 0.95); padding: 10px 14px; border-radius: 6px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15); color: #666; font-size: 14px; font-weight: bold; z-index: 20; }
.instruction-toast { position: absolute; top: 20px; left: 20px; background: rgba(255, 255, 255, 0.9); padding: 8px 12px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); font-size: 12px; color: #666; pointer-events: none; }
.train-panel { background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.train-title { font-size: 13px; font-weight: bold; color: #333; margin-bottom: 10px; }
.train-checkbox { display: flex; align-items: center; font-size: 12px; color: #666; margin: 6px 0 10px; }
.train-tip { margin-top: 8px; font-size: 12px; color: #67c23a; font-weight: bold; }
.csv-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: -6px; margin-bottom: 8px; font-size: 12px; color: #666; }
.btn-link { border: none; background: transparent; padding: 0; color: #409eff; cursor: pointer; font-size: 12px; }
.btn-link:hover { text-decoration: underline; }
.csv-list { display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; padding-right: 4px; }
.csv-row-item { width: 100%; text-align: left; border: 1px solid #eee; background: #fff; border-radius: 8px; padding: 8px 10px; cursor: pointer; display: flex; gap: 8px; align-items: baseline; }
.csv-row-item:hover { border-color: #409eff; }
.csv-row-item.active { border-color: #faad14; background: #fffbe6; }
.csv-row-index { color: #999; font-size: 12px; min-width: 44px; }
.csv-row-id { color: #333; font-size: 12px; font-weight: bold; min-width: 80px; }
.csv-row-preview { color: #666; font-size: 12px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pred-row { margin-bottom: 8px; }
.pred-label { display: block; font-size: 12px; color: #555; margin-bottom: 4px; }
.path-log { margin-top: 10px; font-size: 12px; color: #666; background: #fff; padding: 10px; border-radius: 4px; line-height: 1.5; border: 1px solid #eee; }
.sidebar { width: 320px; background: #fff; border-left: 1px solid #ddd; display: flex; flex-direction: column; min-height: 0; }
.result-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.panel-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.panel-header h3 { margin: 0; font-size: 16px; }
.panel-body { flex: 1; overflow-y: auto; padding: 15px; background: #fafafa; min-height: 0; }
.result-card { background: #fff; padding: 10px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #eee; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.card-title { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 13px; }
.trace-path { font-size: 12px; color: #666; }
.step-condition { background: #e6f7ff; color: #1890ff; padding: 0 3px; border-radius: 2px; }
.tag-success { color: #52c41a; background: #f6ffed; padding: 2px 5px; border-radius: 3px; }
.tag-danger { color: #f5222d; background: #fff1f0; padding: 2px 5px; border-radius: 3px; }
.tag-primary { color: #1890ff; background: #e6f7ff; padding: 2px 5px; border-radius: 3px; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-box { background: #fff; width: 420px; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.form-item { margin-bottom: 15px; }
.form-item label { display: block; margin-bottom: 6px; font-weight: bold; font-size: 14px; color: #333; }
.full-width { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.radios label { margin-right: 15px; cursor: pointer; font-size: 14px; }
.condition-input-group { display: flex; gap: 8px; }
.condition-input-group select { width: 120px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.condition-input-group input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.modal-actions { display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
.modal-actions button { padding: 8px 16px; border-radius: 4px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
.btn-primary { background: #409eff !important; color: white !important; border: none !important; }
.btn-danger { color: #f56c6c; background: #fef0f0; border-color: #fab6b6; }
.btn-add { color: #67c23a; background: #f0f9eb; border-color: #e1f3d8; }
.empty-state { text-align: center; color: #999; padding-top: 40px; line-height: 1.8; }
.modal-tip { background: #fdf6ec; color: #e6a23c; font-size: 12px; padding: 8px; border-radius: 4px; margin-bottom: 12px; border: 1px solid #faecd8; }
.introduce-wrapper { display: flex; flex-direction: column; flex-shrink: 0; overflow: visible; position: relative; min-width: 0; }
.tree-studio :deep(.introduce-container) { position: static !important; width: 100%; height: 100%; display: flex; flex-direction: column; }
.tree-studio :deep(.introduce-box) { position: static !important; height: 100% !important; min-height: 100% !important; transform: none !important; width: auto !important; transition: width 0.2s; flex-shrink: 0; }
.tree-studio :deep(.introduce-box.introduce-hidden) { width: 0 !important; min-width: 0 !important; overflow: hidden; border: none; padding: 0; margin: 0; }
.tree-studio :deep(.introduce-header), .tree-studio :deep(.content) { transition: width 0.2s, opacity 0.2s; }
.tree-studio :deep(.introduce-box.introduce-hidden .introduce-header), .tree-studio :deep(.introduce-box.introduce-hidden .content) { opacity: 0; width: 0 !important; }

.tree-studio :deep(.open-btn-box) { position: fixed !important; right: 20px; top: 100px; z-index: 101; transform: none; }

.sub-tip { color: #67c23a; font-size: 12px; margin-top: 10px; font-weight: bold; }
</style>
