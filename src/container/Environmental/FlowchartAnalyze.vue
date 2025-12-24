<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/index.css';

const container = ref(null);
let lf = null;

// -------- 数据配置 --------
const nodeList = [
  { id: 'env', text: '环境', role: 'start' },
  { id: 'photo', text: '拍照', role: 'step' },
  { id: 'vision', text: '图像识别\n技术', role: 'step' },
  { id: 'nlg', text: '自然语言\n生成技术', role: 'step' },
  { id: 'tts', text: '语音生成\n技术', role: 'step' },
  { id: 'speaker', text: '语音播放', role: 'step' },
  { id: 'blind', text: '视障人士', role: 'end' }
];

const requiredOrder = ['env', 'photo', 'vision', 'nlg', 'tts', 'speaker', 'blind'];

// LogicFlow 数据格式转换
const getGraphData = () => {
  // 1. 定义网格坐标池 (2行4列，共8个位置)
  const gridPositions = [];
  const rows = 2;
  const cols = 4;
  const startX = 150;
  const startY = 150;
  const gapX = 250;
  const gapY = 150;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridPositions.push({
        x: startX + c * gapX,
        y: startY + r * gapY
      });
    }
  }

  // 2. 打乱坐标
  for (let i = gridPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]];
  }

  // 3. 分配坐标
  const nodes = nodeList.map((n, i) => {
    const pos = gridPositions[i];
    return {
      id: n.id,
      type: 'rect',
      x: pos.x,
      y: pos.y,
      text: n.text,
      properties: { 
        ...n,
        width: 160,
        height: 60
      }
    };
  });
  return { nodes, edges: [] };
};

// -------- 样式配置 --------
const theme = {
  rect: {
    width: 200,
    height: 60, // 恢复高度
    radius: 4,
    stroke: '#333',
    strokeWidth: 2,
    fill: '#efc9a0', // 默认黄色
  },
  text: {
    fontSize: 14,
    color: '#333',
    textWidth: 180, // 限制文本宽度
    overflowMode: 'autoWrap', // 超出自动换行
    lineHeight: 1.5,
  },
  polyline: {
    stroke: '#444',
    strokeWidth: 2,
  },
  arrow: {
    offset: 4,
    verticalLength: 2,
  }
};

onMounted(() => {
  if (!container.value) return;

  // 1. 初始化 LogicFlow
  lf = new LogicFlow({
    container: container.value,
    grid: true,
    stopScrollGraph: true,
    stopZoomGraph: true,
    style: theme,
    edgeType: 'polyline',
    keyboard: { enabled: true }, // 开启键盘快捷键，支持 Backspace 删除
  });

  // 2. 注册连线校验规则
  // 规则：源节点必须按顺序连接到目标节点
  lf.on('connection:not-allowed', (data) => {
    window.alert(data.msg);
  });

  // 自定义校验逻辑：在连线建立前拦截
  // LogicFlow 提供了自定义规则功能，这里使用简单的事件监听配合 rule 方式
  // 或者直接利用 checkEdge 方法覆盖
  
  // 定义规则：SequentialConnection
  const rule = {
    message: '连接顺序错误！',
    validate: (sourceNode, targetNode) => {
      const sIndex = requiredOrder.indexOf(sourceNode.id);
      const tIndex = requiredOrder.indexOf(targetNode.id);
      
      if (sIndex === -1 || tIndex === -1) return false;
      
      // 只能连下一步
      if (tIndex !== sIndex + 1) {
        const correctName = nodeList[sIndex + 1]?.text;
        const targetName = targetNode.text?.value || targetNode.text;
        // 返回具体错误信息需要 hack 这里的 rule 机制，或者直接在下面事件处理
        return false;
      }
      return true;
    }
  };

  // 这里的 rule 是全局校验，但 LogicFlow 的 rule 机制主要用于已有边的校验
  // 实时连线校验最好在 connection:not-allowed 或 edge:add 中处理
  // 最简单的方式：监听 edge:add 事件，如果不合法则删除
  
  lf.on('edge:add', ({ data }) => {
    const { sourceNodeId, targetNodeId, id } = data;
    
    // 1. 校验顺序
    const sIndex = requiredOrder.indexOf(sourceNodeId);
    const tIndex = requiredOrder.indexOf(targetNodeId);
    
    let errorMsg = '';
    
    if (tIndex !== sIndex + 1) {
      const correctNext = nodeList[sIndex + 1];
      const currentTarget = nodeList.find(n => n.id === targetNodeId);
      errorMsg = `顺序错误！\n当前【${nodeList[sIndex].text}】应该连接到【${correctNext?.text}】\n而不是【${currentTarget?.text}】`;
    }
    
    // 2. 校验重复连线 (LogicFlow 内部可能允许，但业务不允许重复出口)
    // 检查源节点是否已经有其他出边
    const { edges } = lf.getGraphData();
    const existingEdges = edges.filter(e => e.sourceNodeId === sourceNodeId && e.id !== id);
    if (existingEdges.length > 0) {
      errorMsg = '该步骤已经连接了下一项，请勿重复连接';
    }

    if (errorMsg) {
      window.alert(errorMsg);
      lf.deleteEdge(id); // 立即删除非法边
    }
  });

  // 增加右键删除连线功能
  lf.on('edge:contextmenu', ({ data, e }) => {
    e.preventDefault(); // 阻止默认右键菜单
    // 可以加一个确认弹窗
    if (window.confirm('确认删除这条连线吗？')) {
      lf.deleteEdge(data.id);
    }
  });

  // 3. 渲染数据
  lf.render(getGraphData());
  
  // 4. 定制个别节点样式 (开始/结束节点为绿色)
  // LogicFlow 本身支持 properties 驱动样式，或者渲染后 setProperties
  // 我们可以在 node:render 后处理，或者直接使用数据里的 properties 配合自定义节点。
  // 简单起见，这里直接遍历设置
  nodeList.forEach(n => {
    if (n.role === 'start' || n.role === 'end') {
      lf.setProperties(n.id, {
        style: { fill: '#caedbf' }
      });
    }
  });
  
  // 居中显示
  lf.translateCenter();
  
  // 5. 手动绑定全局删除事件 (解决 LF 焦点问题)
  window.addEventListener('keydown', handleKeydown);
});

const handleKeydown = (e) => {
  if (!lf) return;
  // 监听 Backspace (8) 和 Delete (46)
  if (e.key === 'Backspace' || e.key === 'Delete') {
    const { edges, nodes } = lf.getSelectElements();
    if (edges && edges.length > 0) {
      edges.forEach(edge => lf.deleteEdge(edge.id));
      e.preventDefault(); // 防止误触浏览器后退
    }
    if (nodes && nodes.length > 0) {
      nodes.forEach(node => lf.deleteNode(node.id));
      e.preventDefault();
    }
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  // LogicFlow 没有显式的 destroy 方法，主要是清空 DOM
  lf = null;
});
</script>

<template>
  <div class="container">
    <div class="tool-introduce">
      <h3>流程拼接工具</h3>
      <p>操作说明：</p>
      <ul>
        <li><b>连线</b>：鼠标移入节点边缘，出现<b>锚点</b>后拖拽连接。</li>
        <li><b>移动</b>：拖拽节点可调整位置。</li>
        <li><b>删除</b>：选中连线或节点，按 Backspace 删除。</li>
      </ul>
    </div>
    
    <div class="canvas-wrapper">
      <div class="lf-container" ref="container"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9fafb;
}

.tool-introduce {
  width: 250px;
  flex-shrink: 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-right: 20px;
  line-height: 1.6;
}

.canvas-wrapper {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
}

.lf-container {
  width: 100%;
  height: 100%;
}
</style>