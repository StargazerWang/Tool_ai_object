<template>
  <div class="dt-layout">
    <aside class="dt-sidebar">
      <h3>AI 算法教学</h3>
      <nav>
        <router-link to="/decision-tree/weather">1. 天气数据浏览</router-link>
        <router-link to="/decision-tree/h5-tree">2. 决策树 H5 工具</router-link>
        <router-link to="/decision-tree/blockly-tree?dt=1">3. 决策树 Blockly</router-link>
        <router-link to="/decision-tree/blockly-perceptron?pt=1">4. 感知机 Blockly</router-link>
        <router-link to="/decision-tree/compare">5. 算法结果对比</router-link>
      </nav>
    </aside>

    <main class="dt-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
/* 1. 外层布局：全屏 Flex */
.dt-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 防止出现双重滚动条 */
}

/* 2. 侧边栏样式 */
.dt-sidebar {
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.dt-sidebar h3 { margin-top: 0; margin-bottom: 20px; font-size: 16px; color: #333; font-weight: bold;}
.dt-sidebar nav a {
  display: block;
  margin-bottom: 8px;
  text-decoration: none;
  color: #606266;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s;
}
.dt-sidebar nav a:hover { background: #e9ecef; color: #303133; }
.dt-sidebar nav a.router-link-active { background: #e6f7ff; color: #1890ff; font-weight: 500; border-right: 2px solid #1890ff; }

/* 3. 内容区 */
.dt-content {
  flex: 1;
  display: flex;
  flex-direction: column; /* 让内部子元素也能垂直填充 */
  position: relative;
  overflow: hidden;
  padding: 0; /* 去掉默认的 padding，否则画布撑不满 */
  background: #fff;
}
</style>