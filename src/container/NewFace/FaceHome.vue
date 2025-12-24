<script setup lang="ts">
import { useRouter } from 'vue-router'
// 引入分离后的 CSS 文件
import './FaceHome.css'

const router = useRouter()

// 跳转到 H5 演示页面
const goToH5Demo = () => {
  router.push({ name: 'FaceH5Demo' })
}

// 跳转到 Blockly 页面，并传递具体的类型参数
const goToBlocklyGui = (type: string) => {
  router.push({ path: '/blockly-gui', query: { type: type } })
}
</script>

<template>
  <div class="face-home">
    <div class="header-section">
      <h1>🤖 AI 人脸识别实验室</h1>
      <p>探索计算机视觉的奥秘：从 Web 应用到 Python 算法编程</p>
    </div>

    <div class="cards-container">

      <div class="feature-card h5-card" @click="goToH5Demo">
        <div class="card-icon">📸</div>
        <div class="card-content">
          <h3>Web 端智能识别</h3>
          <p>无需编程，直接体验！支持上传照片或调用本机摄像头进行实时人脸检测。</p>
          <span class="tag">H5 实战</span>
        </div>
      </div>

      <div class="feature-card ai-card detect-card" @click="goToBlocklyGui('face_detect')">
        <div class="card-icon">🔍</div>
        <div class="card-content">
          <h3>人脸检测 (Detect)</h3>
          <p>学习如何初始化 AI 引擎，加载图像或摄像头，并使用算法定位人脸位置。</p>
          <span class="tag">OpenCV 基础</span>
        </div>
      </div>

      <div class="feature-card ai-card register-card" @click="goToBlocklyGui('face_register')">
        <div class="card-icon">📝</div>
        <div class="card-content">
          <h3>人脸注册 (Register)</h3>
          <p>构建人脸数据库！学习如何提取人脸特征并将其保存为已知身份数据。</p>
          <span class="tag">数据录入</span>
        </div>
      </div>

      <div class="feature-card ai-card recognize-card" @click="goToBlocklyGui('face_recognize')">
        <div class="card-icon">🆔</div>
        <div class="card-content">
          <h3>人脸识别 (Recognize)</h3>
          <p>完成最终挑战！对比实时画面与数据库，准确识别出“他是谁”。</p>
          <span class="tag">综合应用</span>
        </div>
      </div>

    </div>
  </div>
</template>