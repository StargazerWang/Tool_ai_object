<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/index.css';

const container = ref(null);
let lf = null;

// -------- 数据配置 --------
const nodeList = [
  { id: 'upload-file', text: '选取上传文件', role: 'start' },
  { id: 'receive-img', text: '接收到图片对象', role: 'fixed' },
  { id: 'analyze-txt', text: '识别生成文字', role: 'step' },
  { id: 'txt-audio', text: '文字转换\n频对象', role: 'step' },
  { id: 'audio-base64', text: '音频转为base64\n编码返回', role: 'step' },
  { id: 'play-adio', text: '显示音频供用户播放', role: 'end' }
];

const requiredOrder = ['upload-file', 'receive-img', 'analyze-txt', 'txt-audio', 'audio-base64', 'play-adio'];

// LogicFlow 数据格式转换
const getGraphData = () => {
  // 1. 定义网格坐标池 (2行4列，共8个位置，够放6-7个节点)
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

  // 2. 洗牌算法 (Fisher-Yates Shuffle) 打乱坐标
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
    edgeType: 'polyline', // 折线
    keyboard: { enabled: true }, // 开启键盘快捷键
  });

  // 2. 注册连线校验规则
  lf.on('connection:not-allowed', (data) => {
    window.alert(data.msg);
  });

  // 3. 实时连线监听
  lf.on('edge:add', ({ data }) => {
    const { sourceNodeId, targetNodeId, id } = data;
    
    const sIndex = requiredOrder.indexOf(sourceNodeId);
    const tIndex = requiredOrder.indexOf(targetNodeId);
    
    let errorMsg = '';
    
    // 校验顺序
    if (sIndex === -1 || tIndex === -1) {
       errorMsg = '无效的节点';
    } else if (tIndex !== sIndex + 1) {
      const correctNext = nodeList[sIndex + 1];
      const currentTarget = nodeList.find(n => n.id === targetNodeId);
      errorMsg = `顺序错误！\n当前【${nodeList[sIndex].text}】应该连接到【${correctNext?.text}】\n而不是【${currentTarget?.text}】`;
    }
    
    // 校验重复连线
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

  // 4. 右键删除连线
  lf.on('edge:contextmenu', ({ data, e }) => {
    e.preventDefault();
    if (window.confirm('确认删除这条连线吗？')) {
      lf.deleteEdge(data.id);
    }
  });

  // 5. 渲染数据
  lf.render(getGraphData());
  
  // 6. 定制样式
  nodeList.forEach(n => {
    if (n.role === 'start' || n.role === 'end') {
      lf.setProperties(n.id, {
        style: { fill: '#caedbf' }
      });
    }
  });
  
  // 居中显示
  lf.translateCenter();

  // 7. 手动绑定全局删除事件 (解决 LF 焦点问题)
  window.addEventListener('keydown', handleKeydown);
});

const handleKeydown = (e) => {
  if (!lf) return;
  // 监听 Backspace (8) 和 Delete (46)
  if (e.key === 'Backspace' || e.key === 'Delete') {
    const { edges, nodes } = lf.getSelectElements();
    if (edges && edges.length > 0) {
      edges.forEach(edge => lf.deleteEdge(edge.id));
      e.preventDefault();
    }
    if (nodes && nodes.length > 0) {
      nodes.forEach(node => lf.deleteNode(node.id));
      e.preventDefault();
    }
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
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
