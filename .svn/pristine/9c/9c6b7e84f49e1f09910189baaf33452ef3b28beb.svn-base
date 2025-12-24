# 文件上传模块

提供统一的文件上传接口，用于将本地文件上传到金山文档指定目录。

## 快速开始

### 1. 初始化

在应用启动时（通常在 `main.js` 中）初始化上传模块：

```javascript
import { init } from '@/utils/upload';

// 初始化上传模块
init();
```

### 2. 上传本地文件

获取文件对象并上传到指定目录：

```javascript
import { uploadFile } from '@/utils/upload';

// 获取文件对象（例如从 input 元素）
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

// 上传文件
await uploadFile(
  file,
  '2111981003',  // groupId - 组ID（从 URL 中获取）
  '100112527250', // parentId - 父ID（从 URL 中获取）
  {
    filename: '自定义名称.docx',
    autoRename: true,
    callback: (progressData) => {
      console.log('上传进度:', progressData.progress + '%');
      console.log('上传状态:', progressData.status);
    }
  }
);
```

## 如何获取 groupId 和 parentId

`groupId` 和 `parentId` 可以从金山文档的 URL 中获取：

**URL 格式：** `365.kdocs.cn/space/6809/{groupId}/{parentId}`

![示例截图](./example.png)

**示例：**

- URL: `365.kdocs.cn/space/6809/2111981003/100112527250`
- `groupId` = `2111981003`（组ID）
- `parentId` = `100112527250`（父ID）

在浏览器中打开目标目录，从地址栏 URL 中提取这两个 ID 即可。

## API 文档

### init()

初始化上传模块。

**说明：** 无需传入参数，内部会自动配置默认值。必须在其他上传方法调用之前执行。建议在应用启动时（`main.js`）调用一次即可。

**返回值：** `boolean` - 初始化是否成功

**示例：**

```javascript
import { init } from '@/utils/upload';

// 在 main.js 中初始化
init(); // 返回 true
```

---

### uploadFile(file, groupId, parentId, options)

上传本地文件到金山文档指定目录。

**说明：** 支持将本地文件上传到金山文档指定目录，并可通过 `options.callback` 实时获知上传进度。

**参数：**

- `file` (File) - **必选**，文件对象
- `groupId` (string) - **必选**，组ID，从金山文档 URL 中获取
- `parentId` (string) - **必选**，父ID，从金山文档 URL 中获取
- `options` (Object, 可选) - 上传选项
  - `filename` (string, 可选) - 自定义文件名，不指定则使用原文件名
  - `autoRename` (boolean, 可选) - 文件重名时自动重命名（加后缀），默认为 `true`
  - `callback` (Function, 可选) - 进度回调函数，形如 `callback(progressData)`

**进度回调说明：**

`callback` 函数会在上传过程中被多次调用，接收 `progressData` 对象，包含以下字段：

```javascript
{
  result: 'ok',        // 结果状态
  taskid: string,      // 任务ID
  status: string,      // 阶段状态，详见下方状态表
  progress: number,    // 当前进度（0-100）
  callstatus: string   // 调用状态
}
```

**状态字段 status 值及其意义：**

| 状态(status)            | 说明                  | 进度范围    |
|------------------------|----------------------|------------|
| start                  | 开始               | 0%         |
| downloading            | 下载中（本地文件上传无该状态，忽略）| 0~50%      |
| downloading finished   | 下载完成（本地文件上传无该状态，忽略）| 50%        |
| start upload           | 开始上传               | 50%        |
| uploading              | 上传中                 | 50~99%     |
| upload finished        | 上传完成               | 100%       |
| error                  | 上传失败               | 0          |

**返回值：** `Promise<Object>` - 返回上传结果的 Promise

**返回对象字段：**

- `success` (boolean) - 是否上传成功
- `taskId` (string) - 任务ID

**示例：**

```javascript
import { uploadFile } from '@/utils/upload';

// 获取文件对象
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

// 上传文件（带进度回调）
try {
  const result = await uploadFile(
    file,
    '2111981003',  // groupId
    '100112527250', // parentId
    {
      filename: '自定义名称.docx',
      autoRename: true,
      callback: (progressData) => {
        // 根据 progressData.status 和 progressData.progress 做进度条展示
        console.log('进度:', progressData.progress + '%');
        console.log('状态:', progressData.status);
      }
    }
  );
  console.log('上传成功:', result);
} catch (error) {
  console.error('上传失败:', error);
}
```

## 完整示例

### Vue 组件中使用

```vue
<template>
  <div>
    <input
      ref="fileInputRef"
      type="file"
      style="display: none"
      @change="handleFileChange"
    />
    <button @click="handleUploadClick" :disabled="isUploading">
      {{ isUploading ? '上传中...' : '上传文件' }}
    </button>
    
    <!-- 上传进度显示 -->
    <div v-if="isUploading || uploadMessage" class="upload-info">
      <div class="upload-message">{{ uploadMessage }}</div>
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <div class="progress-text">{{ uploadProgress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { uploadFile } from '@/utils/upload';

const fileInputRef = ref(null);
const uploadProgress = ref(0);
const uploadStatus = ref('');
const isUploading = ref(false);
const uploadMessage = ref('');

// 上传配置，正常应该通过接口获取，此处先写死
const GROUP_ID = '2111981003';
const PARENT_ID = '100112527250';

// 触发文件选择
function handleUploadClick() {
  fileInputRef.value?.click();
}

// 处理文件上传
async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  try {
    isUploading.value = true;
    uploadProgress.value = 0;
    uploadStatus.value = '';
    uploadMessage.value = `准备上传: ${file.name}`;

    const result = await uploadFile(
      file,
      GROUP_ID,
      PARENT_ID,
      {
        filename: file.name,
        autoRename: true,
        callback: (progressData) => {
          // 更新进度
          uploadProgress.value = progressData.progress || 0;
          uploadStatus.value = progressData.status || '';
          
          // 根据状态显示不同消息
          const statusMap = {
            'start': '开始上传',
            'downloading': '下载中...',
            'downloading finished': '下载完成',
            'start upload': '开始上传',
            'uploading': '上传中...',
            'upload finished': '上传完成',
            'error': '上传失败'
          };
          
          uploadMessage.value = statusMap[progressData.status] || progressData.status || '上传中...';
        }
      }
    );

    uploadMessage.value = '上传成功！';
    console.log('上传结果:', result);
    
    // 3秒后清除消息
    setTimeout(() => {
      uploadMessage.value = '';
      uploadProgress.value = 0;
      uploadStatus.value = '';
    }, 3000);
  } catch (error) {
    console.error('上传失败:', error);
    uploadMessage.value = `上传失败: ${error.message || '未知错误'}`;
    uploadStatus.value = 'error';
    uploadProgress.value = 0;
  } finally {
    isUploading.value = false;
    // 清空文件选择，以便可以重复选择同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
}
</script>

<style scoped>
.upload-info {
  margin-top: 12px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.upload-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}
</style>
```

### 在 main.js 中初始化

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { init as initReport } from './utils/report';
import { init as initUpload } from './utils/upload';

// 初始化埋点上报
initReport();

// 初始化上传模块
initUpload();

createApp(App).use(router).mount('#app');
```

### 纯 JavaScript 使用

```javascript
import { uploadFile } from '@/utils/upload';

// 获取文件对象
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

// 上传文件
uploadFile(
  file,
  '2111981003',  // groupId - 从 URL 中获取
  '100112527250', // parentId - 从 URL 中获取
  {
    filename: '自定义名称.docx',
    autoRename: true,
    callback: (progressData) => {
      const result = progressData;
      console.log('进度:', result.progress + '%');
      console.log('状态:', result.status);
      
      // 根据状态做 UI 更新
      if (result.status === 'upload finished') {
        console.log('上传完成！');
      } else if (result.status === 'error') {
        console.error('上传失败');
      }
    }
  }
).then(result => {
  console.log('上传成功:', result);
}).catch(error => {
  console.error('上传失败:', error);
});
```

## 注意事项

1. **初始化顺序**：必须在调用 `uploadFile` 之前先调用 `init()` 进行初始化
2. **初始化位置**：建议在应用启动时（`main.js`）初始化一次即可，无需在每个组件中重复初始化
3. **参数必填项**：`file`、`groupId`、`parentId` 都是必填参数，缺少任一参数都会导致上传失败
4. **groupId 和 parentId 获取**：这两个参数需要从金山文档的 URL 中获取，URL 格式为 `365.kdocs.cn/space/6809/{groupId}/{parentId}`
5. **进度回调**：`callback` 函数会在上传过程中被多次调用，可用于实时更新 UI 进度条
6. **错误处理**：上传方法返回 Promise，需要使用 `.catch()` 或 `try-catch` 处理错误
7. **文件重名**：当 `autoRename` 为 `true` 时，如果目标目录已存在同名文件，会自动重命名（添加后缀）
8. **大文件上传**：模块支持大文件分块上传，会自动处理文件分块和合并逻辑

## 开发说明

- **真实实现**：`core.impl.js` 使用 `@ks-saas-edu/upload2kdocs` SDK 实现真实的上传功能
- **Mock 实现**：`core.mock.js` 提供 Mock 实现，仅用于开发测试，不调用真实的 SDK
- **单例模式**：上传管理器使用单例模式，确保全局只有一个实例
- **缓存机制**：底层 SDK 使用 CacheStorage 缓存上传任务，支持断点续传

## 作者

`wuliangxing@wps.cn`
