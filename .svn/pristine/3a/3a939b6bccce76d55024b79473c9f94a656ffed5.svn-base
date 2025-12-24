# 数据埋点上报模块

提供统一的数据埋点上报接口，用于收集页面访问和用户行为数据。

## 快速开始

### 1. 初始化

在应用启动时（通常在 `main.js` 中）初始化埋点模块：

```javascript
import { init } from '@/utils/report';

// 初始化埋点上报
init();
```

### 2. 设置用户信息（暂时不需要调用，等登录接通后再处理）

如果需要在埋点数据中包含用户信息，可以调用 `setUserInfo`：

```javascript
import { setUserInfo } from '@/utils/report';

setUserInfo({
  userId: 'user123',           // WPS ID（可选）
  companyId: 'company001',     // 公司ID（可选）
  companyName: '示例公司'      // 公司名称（可选）
});
```

## API 文档

### init()

初始化埋点上报模块。

**说明：** 无需传入参数，内部会自动配置默认值。必须在其他上报方法调用之前执行。

**返回值：** `boolean` - 初始化是否成功

**示例：**

```javascript
import { init } from '@/utils/report';

init(); // 返回 true
```

---

### setUserInfo(userInfo)

设置用户信息。

**参数：**

- `userInfo` (Object) - 用户信息对象
  - `userId` (string) - 用户WPS账号ID，可选
  - `companyId` (string) - 公司ID，可选
  - `companyName` (string) - 公司名称，可选

**返回值：** `boolean` - 设置是否成功

**示例：**

```javascript
import { setUserInfo } from '@/utils/report';

setUserInfo({
  userId: 'wps_user_123',
  companyId: 'company_001',
  companyName: '金山办公'
});
```

---

### pageShow(params)

页面访问上报。当用户进入页面时调用。

**参数：**

- `params` (Object) - 上报参数对象
  - `pageName` (string) - 页面名称，**必填**
  - `IdNum` (string) - 页面ID编号，**必填**
  - `textInfo` (string) - 页面文本信息，**必填**

**返回值：** `Promise` - 返回上报结果的 Promise

**示例：**

```javascript
import { pageShow } from '@/utils/report';
import { onMounted } from 'vue';

// 在 Vue 组件中使用
onMounted(() => {
  pageShow({
    pageName: '五子棋游戏',
    IdNum: 'tictactoe-play',
    textInfo: '五子棋游戏页面'
  });
});
```

---

### buttonClick(params)

按钮点击事件上报。当用户点击按钮时调用。

**参数：**

- `params` (Object) - 上报参数对象
  - `pageName` (string) - 页面名称，**必填**
  - `name` (string) - 按钮名称，**必填**
  - `IdNum` (string) - 按钮ID编号，**必填**
  - `textInfo` (string) - 按钮文本信息，**必填**

**返回值：** `Promise` - 返回上报结果的 Promise

**示例：**

```javascript
import { buttonClick } from '@/utils/report';

// 在按钮点击事件中调用
function handleButtonClick() {
  buttonClick({
    pageName: '五子棋游戏',
    name: '开始对局',
    IdNum: 'btn-start-game',
    textInfo: '点击开始对局按钮'
  });
}
```

**在模板中使用：**

```vue
<template>
  <button @click="handleStart">开始对局</button>
</template>

<script setup>
import { buttonClick } from '@/utils/report';

function handleStart() {
  buttonClick({
    pageName: '五子棋游戏',
    name: '开始对局',
    IdNum: 'btn-start-game',
    textInfo: '点击开始对局按钮'
  });
  
  // 其他业务逻辑...
}
</script>
```

## 完整示例

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { init, setUserInfo } from './utils/report';

// 1. 初始化埋点上报
init();

// 2. 设置用户信息（可选，根据实际业务需求）
setUserInfo({
  userId: 'wps_user_123',
  companyId: 'company_001',
  companyName: '金山办公'
});

createApp(App).use(router).mount('#app');
```

```vue
<!-- 页面组件 -->
<script setup>
import { onMounted } from 'vue';
import { pageShow, buttonClick } from '@/utils/report';

// 3. 页面显示时上报
onMounted(() => {
  pageShow({
    pageName: '五子棋游戏',
    IdNum: 'tictactoe-play',
    textInfo: '五子棋游戏页面'
  });
});

// 4. 按钮点击时上报
function handleButtonClick() {
  buttonClick({
    pageName: '五子棋游戏',
    name: '开始对局',
    IdNum: 'btn-start-game',
    textInfo: '点击开始对局按钮'
  });
}
</script>
```

## 注意事项

1. **初始化顺序**：必须在调用其他上报方法之前先调用 `init()` 进行初始化
2. **参数必填项**：所有标记为"必填"的参数都必须提供，否则上报会失败
3. **错误处理**：上报方法返回 Promise，可以使用 `.catch()` 处理错误
4. **开发环境**：当前为 Mock 实现，仅用于开发测试。生产环境需要教育研发团队实现真实的上报逻辑

## 开发说明

- **Mock 实现**：当前版本为 Mock 实现，数据仅会在控制台输出
- **真实实现**：教育研发团队需要在 `core.js` 中的 `_send` 方法中实现真实的上报逻辑（如调用数仓 SDK）
- **TODO**：代码中标记了 `TODO` 的地方需要后续完善

## 作者

`wuliangxing@wps.cn`
