<template>
  <div class="page-wrapper">
    <div class="content-area">
      <div class="h5-container">

        <div class="control-panel">
          <h2>🔍 AI 人脸识别流水线</h2>

          <div class="status-bar" :class="statusClass" ref="guideStatusText">
            <span class="status-icon">{{ statusIcon }}</span>
            <div class="status-content">
              <span v-if="!isModelLoaded">
                {{ loadingText }}
                <div class="loading-progress-bar">
                  <div class="progress-inner" :style="{ width: loadProgress + '%' }"></div>
                </div>
              </span>
              <span v-else>
                AI 引擎就绪 (耗时 <strong>{{ loadTime }}</strong>s)，请按步骤操作
              </span>
            </div>
          </div>

          <div class="workflow-layout" :class="{ 'layout-loading': !isModelLoaded }">

            <div class="card" :class="{ active: isModelLoaded, disabled: !isModelLoaded }" ref="step1Card">
              <span class="step-badge">Step 1</span>
              <h3>📸 采集人脸</h3>
              <p class="card-desc">上传一张单人照或开启摄像头截图。</p>

              <div class="action-column">
                <input type="file" ref="registerFileInput" @change="handleRegisterFile" accept="image/*" style="display:none">
                <button class="btn primary" @click="triggerUpload('register')">📂 上传图片</button>
                <button class="btn warning" @click="toggleRegisterCamera">
                  {{ isCameraOpen && cameraContext === 'register' ? '📷 拍照截取' : '📷 开启摄像头' }}
                </button>
                <button v-if="isCameraOpen && cameraContext === 'register'" class="btn danger" @click="closeCamera">关闭画面</button>
              </div>
            </div>

            <div class="flow-arrow">➜</div>

            <div class="card" :class="{ active: step1Done, disabled: !step1Done }" ref="step2Card">
              <span class="step-badge">Step 2</span>
              <h3>📝 写入标签</h3>
              <p class="card-desc">输入姓名并确认，将其存入底库。</p>

              <div class="action-column">
                <div class="stat-box">
                  <span class="stat-label">库内人数</span>
                  <span class="stat-number">{{ registeredFaces.length }}</span>
                </div>
                <div class="fancy-input-group">
                  <label class="fancy-input-label">姓名 (Name)</label>
                  <input v-model="registerName" type="text" class="fancy-input" placeholder="例如：Tom" :disabled="!step1Done" />
                </div>
                <button class="btn success" @click="submitRegister" :disabled="!canSubmitRegister">
                  <span v-if="isProcessing">⏳ 处理中...</span>
                  <span v-else>✅ 确认入库</span>
                </button>
              </div>
            </div>

            <div class="flow-arrow">➜</div>

            <div class="card" :class="{ active: hasRegisteredFaces, disabled: !hasRegisteredFaces }" ref="step3Card">
              <span class="step-badge">Step 3</span>
              <h3>🔍 智能识别</h3>
              <p class="card-desc">上传新图或开摄像头，AI将识别身份。</p>

              <div class="action-column">
                <input type="file" ref="recognizeFileInput" @change="handleRecognizeFile" accept="image/*" style="display:none">
                <button class="btn primary" @click="triggerUpload('recognize')">📂 上传图片识别</button>
                <button class="btn primary" @click="toggleRecognizeCamera">
                  {{ isCameraOpen && cameraContext === 'recognize' ? '📷 拍照并识别' : '📷 开启摄像头识别' }}
                </button>
                <button v-if="isCameraOpen && cameraContext === 'recognize'" class="btn danger" @click="closeCamera">关闭摄像头</button>
              </div>
            </div>

          </div>
        </div>

        <div class="connector-wrapper">
          <div class="connector-item"><div class="big-down-arrow">⬇</div></div>
          <div class="connector-spacer"></div>
          <div class="connector-item"><div class="big-down-arrow">⬇</div></div>
        </div>

        <div class="display-area" ref="guideDisplayArea">
          <span class="step-badge output-badge">Step 4</span>
          <span class="display-title-overlay">Output Source</span>

          <video v-show="isCameraOpen" ref="video" autoplay playsinline class="preview-media"></video>

          <div class="canvas-wrapper" v-show="imageUrl || captured">
            <img v-if="imageUrl" :src="imageUrl" ref="targetImg" class="preview-media" @load="onImageLoad"/>
            <canvas ref="overlay" class="overlay-canvas"></canvas>
          </div>

          <transition name="fade">
            <div v-if="isProcessing" class="loading-overlay">
              <div class="spinner"></div>
              <p>AI 正在运算中...</p>
            </div>
          </transition>

          <div v-if="!isCameraOpen && !imageUrl" class="empty-placeholder">
            等待 Step 1 或 Step 3 的输入源...
          </div>
        </div>

      </div>
    </div>

    <div class="introduce-wrapper">
      <Introduce :path="'/tool-introduce/face-recognition-h5/guide.md'" />
    </div>
  </div>
</template>

<script>
import guide from '@/utils/guide';
import Introduce from '@/components/Introduce.vue';
import { buildUrl } from '@/utils/api';

export default {
  name: 'H5Recognition',
  components: { Introduce },
  data() {
    return {
      cameraContext: null,
      isCameraOpen: false,
      imageUrl: null,
      captured: false,
      isProcessing: false, // 统一的 Loading 状态
      stream: null,
      isModelLoaded: false,
      faceApi: null,
      loadTime: 0,
      loadProgress: 0, // 进度条数值
      loadingText: '正在准备环境...',
      registerName: '',
      registeredFaces: []
    };
  },
  computed: {
    step1Done() { return this.isModelLoaded && this.imageUrl && this.cameraContext === 'register'; },
    canSubmitRegister() { return this.step1Done && this.registerName && !this.isProcessing; },
    hasRegisteredFaces() { return this.registeredFaces.length > 0; },
    statusClass() { return this.isModelLoaded ? 'success' : 'loading'; },
    statusIcon() { return this.isModelLoaded ? '✅' : '🚀'; }
  },
  mounted() {
    // 🟢 核心优化：延迟执行 AI 加载，优先让页面渲染完成 (降低 FCP)
    // 使用 requestAnimationFrame 确保 UI 已经绘制了一帧
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.initFaceApi();
      }, 100);
    });

    this.$nextTick(() => {
      setTimeout(() => {
        if (this.$refs.step1Card) this.startGuide();
      }, 1000); // 稍微延后引导，避免和 loading 冲突
    });
  },
  methods: {
    async initFaceApi() {
      try {
        this.updateProgress(10, "正在动态加载引擎...");
        const faceapi = await import('@vladmandic/face-api');

        this.updateProgress(30, "初始化 WebGL 加速...");
        await faceapi.tf.setBackend('webgl');
        await faceapi.tf.ready();
        this.faceApi = faceapi;

        this.updateProgress(50, "正在加载 AI 模型...");
        await this.loadFaceModel();

        this.updateProgress(100, "加载完成");
      } catch (e) {
        console.error('AI 初始化失败:', e);
        this.loadingText = "初始化失败，请刷新重试";
      }
    },

    updateProgress(val, text) {
      this.loadProgress = val;
      if(text) this.loadingText = text;
    },

    async loadFaceModel() {
      try {
        const startTime = performance.now();
        const modelPath = buildUrl('/NewFace/model');

        // 并行加载，利用 Promise.all
        await Promise.all([
          this.faceApi.nets.tinyFaceDetector.loadFromUri(modelPath),
          this.faceApi.nets.faceLandmark68TinyNet.loadFromUri(modelPath),
          this.faceApi.nets.faceRecognitionNet.loadFromUri(modelPath)
        ]);

        this.loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
        this.isModelLoaded = true;
      } catch (error) {
        console.error("❌ 模型加载失败:", error);
        alert("模型加载失败，请检查网络或文件路径");
      }
    },

    triggerUpload(type) {
      if(type === 'register') this.$refs.registerFileInput && this.$refs.registerFileInput.click();
      if(type === 'recognize') this.$refs.recognizeFileInput && this.$refs.recognizeFileInput.click();
    },

    // --- 业务逻辑保持一致，只增加了 isProcessing 控制 ---

    startGuide() {
      const steps = [
        { element: this.$refs.step1Card, popover: { title: 'Step 1: 采集', description: '上传一张照片或者拍照，作为底库素材。', side: "bottom" } },
        { element: this.$refs.step2Card, popover: { title: 'Step 2: 入库', description: '输入名字并保存，激活识别功能。', side: "bottom" } },
        { element: this.$refs.step3Card, popover: { title: 'Step 3: 识别', description: '人脸库有数据后，在这里进行比对。', side: "bottom" } },
        { element: this.$refs.guideDisplayArea, popover: { title: 'Step 4: 结果', description: '实时画面和结果展示区。', side: "top" } }
      ];
      guide(steps);
    },

    resetData() {
      if (this.imageUrl && this.imageUrl.startsWith('blob:')) URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
      this.captured = false;
      this.clearCanvas();
    },

    async toggleRegisterCamera() {
      if (this.isCameraOpen && this.cameraContext === 'recognize') this.closeCamera();
      this.cameraContext = 'register';
      if (this.isCameraOpen) this.captureFrame();
      else { this.registerName = ''; await this.openCamera(); }
    },

    async toggleRecognizeCamera() {
      if (this.isCameraOpen && this.cameraContext === 'register') this.closeCamera();
      this.cameraContext = 'recognize';
      if (this.isCameraOpen) this.captureFrame();
      else await this.openCamera();
    },

    async openCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }}); // 限制分辨率提升性能
        this.$refs.video.srcObject = this.stream;
        this.isCameraOpen = true;
        this.resetData();
      } catch (err) { alert("无法访问摄像头: " + err.message); }
    },

    closeCamera() {
      if (this.stream) { this.stream.getTracks().forEach(track => track.stop()); this.stream = null; }
      this.isCameraOpen = false;
    },

    captureFrame() {
      const video = this.$refs.video;
      if (!video) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      this.resetData();
      this.imageUrl = canvas.toDataURL('image/jpeg', 0.8); // 使用 JPEG 0.8 压缩
      this.closeCamera();
      this.captured = true;
    },

    handleRegisterFile(e) { this.handleFile(e, 'register'); },
    handleRecognizeFile(e) { this.handleFile(e, 'recognize'); },

    handleFile(e, context) {
      const file = e.target.files[0];
      if (!file) return;
      this.cameraContext = context;
      this.resetData();
      this.closeCamera();
      this.imageUrl = URL.createObjectURL(file);
      e.target.value = '';
    },

    async onImageLoad() {
      const img = this.$refs.targetImg;
      if (!img) return;
      if (this.cameraContext === 'register') await this.detectAndDraw(img);
      else if (this.cameraContext === 'recognize') await this.recognizeFaces(img);
    },

    clearCanvas() {
      const canvas = this.$refs.overlay;
      if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    },

    drawRoundedRect(ctx, x, y, width, height, radius, color, isFilled = false) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (isFilled) { ctx.fillStyle = color; ctx.fill(); }
      else { ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.stroke(); }
      ctx.restore();
    },

    async detectAndDraw(imgElement) {
      if (!this.isModelLoaded) return;
      this.isProcessing = true; // 开启 loading
      try {
        const options = new this.faceApi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.5});
        const detections = await this.faceApi.detectAllFaces(imgElement, options);

        const canvas = this.$refs.overlay;
        const displaySize = {width: imgElement.width, height: imgElement.height};
        this.faceApi.matchDimensions(canvas, displaySize);
        const resizedDetections = this.faceApi.resizeResults(detections, displaySize);

        this.clearCanvas();
        const ctx = canvas.getContext('2d');
        resizedDetections.forEach(det => {
          const {x, y, width, height} = det.box;
          this.drawRoundedRect(ctx, x, y, width, height, 10, '#409eff');
        });
      } finally { this.isProcessing = false; }
    },

    async submitRegister() {
      if (!this.canSubmitRegister) return;
      this.isProcessing = true;
      try {
        const imgElement = this.$refs.targetImg;
        const options = new this.faceApi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.5});

        const detections = await this.faceApi
            .detectAllFaces(imgElement, options)
            .withFaceLandmarks(true)
            .withFaceDescriptors();

        if (!detections.length) { alert("未检测到人脸，无法注册"); return; }

        const bestFace = detections[0];
        this.registeredFaces.push({
          name: this.registerName,
          descriptors: [Array.from(bestFace.descriptor)]
        });

        alert(`✅ 注册成功！\n姓名：${this.registerName}`);
        this.registerName = '';
      } catch (e) {
        console.error(e); alert("注册失败：" + e.message);
      } finally {
        this.isProcessing = false;
      }
    },

    async recognizeFaces(imgElement) {
      if (!this.isModelLoaded || !this.registeredFaces.length) return;
      this.isProcessing = true;
      try {
        const options = new this.faceApi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.5});
        const detections = await this.faceApi
            .detectAllFaces(imgElement, options)
            .withFaceLandmarks(true)
            .withFaceDescriptors();

        if (!detections.length) return;

        const labeledDescriptors = this.registeredFaces.map(item =>
            new this.faceApi.LabeledFaceDescriptors(item.name, item.descriptors.map(d => new Float32Array(d)))
        );

        const matcher = new this.faceApi.FaceMatcher(labeledDescriptors, 0.5);
        const canvas = this.$refs.overlay;
        const displaySize = {width: imgElement.width, height: imgElement.height};
        this.faceApi.matchDimensions(canvas, displaySize);
        const resizedDetections = this.faceApi.resizeResults(detections, displaySize);

        this.clearCanvas();
        const ctx = canvas.getContext('2d');
        const THRESHOLD = 60; // 稍微降低阈值提高体验

        resizedDetections.forEach(det => {
          const bestMatch = matcher.findBestMatch(det.descriptor);
          const {x, y, width, height} = det.detection.box;

          const isUnknown = bestMatch.label === 'unknown';
          const score = Math.round((1 - bestMatch.distance) * 100);
          const isRecognized = !isUnknown && score >= THRESHOLD;

          let color = isRecognized ? '#67C23A' : '#F56C6C';
          let labelText = isRecognized ? `${bestMatch.label} (${score}%)` : 'Unknown';

          this.drawRoundedRect(ctx, x, y, width, height, 10, color, false);

          ctx.font = 'bold 16px "Microsoft YaHei"';
          const textHeight = 30;
          const textWidth = ctx.measureText(labelText).width + 20;
          let labelY = y - textHeight > 0 ? y - textHeight : y + height;

          this.drawRoundedRect(ctx, x, labelY, textWidth, textHeight, 5, color, true);
          ctx.fillStyle = '#fff';
          ctx.fillText(labelText, x + 10, labelY + 20);
        });
      } catch (error) {
        console.error("识别出错:", error);
      } finally {
        this.isProcessing = false;
      }
    }
  },
  beforeUnmount() {
    this.closeCamera();
    if (this.imageUrl && this.imageUrl.startsWith('blob:')) URL.revokeObjectURL(this.imageUrl);
  }
};
</script>

<style scoped>
/* 🟢 优化点 3: 样式优化，增加过渡效果，减少生硬感 */

.h5-container {
  display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto;
  font-family: 'Segoe UI', "Microsoft YaHei", sans-serif; padding-bottom: 20px;
}

.control-panel {
  background: white; padding: 20px 15px; border-radius: 16px; width: 100%; text-align: center;
  margin-bottom: 20px; box-sizing: border-box; z-index: 2; position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* 状态条 */
.status-bar {
  display: flex; align-items: center; justify-content: center; padding: 12px 20px;
  border-radius: 50px; margin-bottom: 25px; font-size: 14px; font-weight: 500;
  transition: all 0.5s ease;
}
.status-bar.loading { background: #fdf6ec; color: #b88230; border: 1px solid #faecd8; }
.status-bar.success { background: #f0f9eb; color: #2b4e28; border: 1px solid #c2e7b0; }
.status-icon { margin-right: 12px; font-size: 20px; }
.status-content { flex: 1; max-width: 400px; text-align: left; position: relative; }

/* 进度条 */
.loading-progress-bar {
  width: 100%; height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px;
  margin-top: 6px; overflow: hidden;
}
.progress-inner {
  height: 100%; background: #409eff; transition: width 0.3s ease;
}

/* 布局区域 */
.workflow-layout {
  display: flex; justify-content: space-between; gap: 10px; position: relative;
  transition: opacity 0.5s;
}
.workflow-layout.layout-loading { opacity: 0.7; pointer-events: none; filter: grayscale(0.8); }

.flow-arrow {
  display: flex; align-items: center; justify-content: center; font-size: 32px;
  color: #409eff; width: 40px; margin: 0 5px; animation: flowBreathe 1.8s infinite;
}

.card {
  flex: 1; min-width: 0; background: #fff; border: 1px solid #e4e7ed; border-radius: 12px;
  padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex; flex-direction: column; transition: all 0.3s; position: relative;
}
.card.active { border-color: #c2e7b0; box-shadow: 0 0 15px rgba(103, 194, 58, 0.1); }
.card.disabled { opacity: 0.6; background: #f9fafc; }

.step-badge {
  position: absolute; top: 0; left: 0; background: #f4f4f5; color: #909399; font-size: 12px;
  padding: 4px 12px; border-bottom-right-radius: 10px; font-weight: bold;
}
.card.active .step-badge { background: #e1f3d8; color: #67c23a; }

.card h3 { margin: 15px 0 8px; font-size: 16px; color: #303133; text-align: center; }
.card-desc { margin: 0 0 12px; font-size: 12px; color: #909399; text-align: center; height: 34px; }
.action-column { display: flex; flex-direction: column; gap: 10px; flex: 1; justify-content: center; }

/* 按钮与输入框 */
.btn {
  width: 100%; padding: 9px 0; border: none; border-radius: 6px; cursor: pointer; color: white;
  font-weight: 600; font-size: 13px; transition: transform 0.1s; display: flex; align-items: center; justify-content: center;
}
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.primary { background: linear-gradient(135deg, #409eff, #3a8ee6); }
.success { background: linear-gradient(135deg, #67c23a, #529b2e); }
.warning { background: linear-gradient(135deg, #e6a23c, #d6922c); }
.danger { background: linear-gradient(135deg, #f56c6c, #e64242); }

.stat-box {
  display: flex; justify-content: space-between; background: #f0f2f5; color: #606266;
  padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; font-size: 12px;
}
.stat-number { font-weight: bold; color: #409eff; font-size: 14px; }

.fancy-input {
  width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 6px;
  box-sizing: border-box; font-size: 13px; transition: border 0.2s;
}
.fancy-input:focus { border-color: #409eff; outline: none; }

/* 连接区 */
.connector-wrapper {
  display: flex; justify-content: space-between; width: 100%; padding: 0 15px;
  margin: -15px 0; pointer-events: none;
}
.big-down-arrow { font-size: 40px; color: #e4e7ed; }
.connector-spacer { flex: 1; }

/* 结果显示区 */
.display-area {
  position: relative; width: 100%; min-height: 400px; background: #000; border-radius: 16px;
  display: flex; justify-content: center; align-items: center; overflow: hidden; margin-top: 0;
}
.step-badge.output-badge { background: rgba(255,255,255,0.9); color: #333; z-index: 5; }
.display-title-overlay { position: absolute; top: 15px; right: 20px; color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 600; z-index: 5; }

.preview-media { max-width: 100%; max-height: 400px; display: block; }
.canvas-wrapper { position: relative; line-height: 0; }
.overlay-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

.empty-placeholder { color: #555; font-size: 14px; display: flex; align-items: center; gap: 10px; }

/* 遮罩动画 */
.loading-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7); color: white;
  display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10;
  backdrop-filter: blur(2px);
}
.spinner {
  width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%; border-top-color: #fff; animation: spin 1s infinite linear; margin-bottom: 10px;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes flowBreathe { 0%, 100% { transform: translateX(0); opacity: 0.5; } 50% { transform: translateX(5px); opacity: 1; } }

/* 响应式 */
@media (max-width: 900px) {
  .workflow-layout { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); margin: 5px auto; }
  .connector-wrapper { display: none; }
}

/* 页面容器适配 */
.page-wrapper { width: 100vw; height: 100vh; display: flex; background: #f6f8fa; overflow: hidden; }
.content-area { flex: 1; overflow-y: auto; padding: 10px 20px; }
.introduce-wrapper { border-left: 1px solid #e0e0e0; }
</style>