# 账号管理模块

提供统一的账号管理接口，用于处理用户登录、获取用户信息、监听账号变更等功能。

## 快速开始

### 1. 检查登录状态

在应用启动时或需要判断用户是否已登录时，通过 `getUserInfo()` 获取用户信息，然后判断 `userId` 是否为 0：

```javascript
import { getUserInfo, login } from '@/utils/account';

// 获取用户信息并判断登录状态
const userInfo = await getUserInfo();
if (userInfo.userId === 0) {
  // 用户未登录，跳转到登录页
  login();
}
```

### 2. 获取用户信息

获取当前登录用户的信息：

```javascript
import { getUserInfo } from '@/utils/account';

const userInfo = await getUserInfo();
console.log('用户ID:', userInfo.userId);
console.log('用户昵称:', userInfo.nickName);
console.log('企业名称:', userInfo.companyName);
```

### 3. 监听账号变更

当用户切换账号时，可以监听账号变更事件：

```javascript
import { onAccountChange } from '@/utils/account';

// 在组件挂载时注册监听
onAccountChange((userInfo) => {
  console.log('账号已切换，新用户信息:', userInfo);
  // 更新页面显示的用户信息
});
```

## API 文档

### getUserInfo(forceRefresh)

获取当前登录用户的信息。

**说明：** 如果获取失败（如未登录或请求异常），会返回默认的未登录用户信息对象（userId 为 0）。**判断登录状态：通过 `userInfo.userId !== 0` 来判断是否已登录。**

**参数：**

- `forceRefresh` (boolean, 可选) - 是否强制刷新，忽略缓存直接请求最新数据，默认为 `false`

**返回值：** `Promise<Object>` - 返回用户信息的 Promise

**返回对象字段：**

- `userId` (number) - 用户ID，未登录时为0
- `nickName` (string) - 用户昵称
- `avatarUrl` (string) - 头像地址
- `companyLogo` (string) - 企业LOGO图片地址
- `companyId` (number) - 企业ID，个人账号企业ID为0
- `companyName` (string) - 企业名称
- `isCompanyAccount` (boolean) - 是否为新的企业账号

**示例：**

```javascript
import { getUserInfo, login } from '@/utils/account';

// 获取用户信息并判断登录状态
const userInfo = await getUserInfo();
if (userInfo.userId !== 0) {
  console.log('已登录用户:', userInfo.nickName);
  console.log('所属企业:', userInfo.companyName);
} else {
  console.log('用户未登录');
  login();
}
```

---

### login()

调用登录页，触发用户登录流程。

**说明：** 打开登录页面，用户完成登录后会自动跳转回当前页面。

**返回值：** `void`

**示例：**

```javascript
import { login } from '@/utils/account';

// 当用户点击登录按钮时
function handleLogin() {
  login();
}
```

---

### logout()

调用退登接口，执行用户退出登录操作。

**返回值：** `void`

**示例：**

```javascript
import { logout } from '@/utils/account';

// 当用户点击退出登录按钮时
function handleLogout() {
  logout();
  // 退出后可能需要跳转到登录页或首页
}
```

---

### onAccountChange(callback)

监听账号切换事件。

**说明：** 当用户切换账号时触发回调。当账号变更时会自动更新内部用户信息并触发回调。

**参数：**

- `callback` (Function) - 账号变更时的回调函数
  - `callback(userInfo)` - 回调函数接收新的用户信息对象作为参数

**返回值：** `void`

**示例：**

```javascript
import { onAccountChange } from '@/utils/account';

// 在组件挂载时注册监听
onAccountChange((userInfo) => {
  console.log('账号已切换，新用户信息:', userInfo);
  // 更新页面显示的用户信息
  updateUserDisplay(userInfo);
});
```

---

### mockAccountChange(eventType)

模拟账号变更事件，仅用于开发测试。

**说明：** 此方法在真实实现中不执行任何操作，仅在 mock 版本中实现具体的模拟逻辑。

**参数：**

- `eventType` (string, 可选) - 事件类型，如 'login'、'logout'、'switch' 等

**返回值：** `void`

**示例：**

```javascript
import { mockAccountChange } from '@/utils/account';

// 在开发环境中模拟账号变更
mockAccountChange('login');
```

## 完整示例

### Vue 组件中使用

```vue
<template>
  <div>
    <div v-if="!isLoggedIn">
      <p>您还未登录</p>
      <button @click="handleLogin">登录</button>
    </div>
    <div v-else>
      <p>欢迎，{{ userInfo.nickName }}</p>
      <p>企业：{{ userInfo.companyName }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { login, logout, getUserInfo, onAccountChange } from '@/utils/account';

const isLoggedIn = ref(false);
const userInfo = ref({});

// 检查登录状态并获取用户信息
async function checkUserStatus() {
  userInfo.value = await getUserInfo();
  isLoggedIn.value = userInfo.value.userId !== 0;
}

// 登录
function handleLogin() {
  login();
}

// 退出登录
function handleLogout() {
  logout();
  isLoggedIn.value = false;
  userInfo.value = {};
}

onMounted(async () => {
  await checkUserStatus();
  
  // 监听账号变更
  onAccountChange((newUserInfo) => {
    console.log('账号已切换:', newUserInfo);
    userInfo.value = newUserInfo;
    isLoggedIn.value = newUserInfo.userId !== 0;
  });
});
</script>
```

### 在路由守卫中使用

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { getUserInfo, login } from '@/utils/account';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... 路由配置
  ]
});

// 路由守卫：检查登录状态
router.beforeEach(async (to, from, next) => {
  // 某些页面需要登录
  if (to.meta.requiresAuth) {
    const userInfo = await getUserInfo();
    if (userInfo.userId === 0) {
      // 未登录，跳转到登录页
      login();
      return;
    }
  }
  next();
});
```

### 与埋点上报模块结合使用

```javascript
import { getUserInfo } from '@/utils/account';
import { setUserInfo } from '@/utils/report';

// 获取用户信息后，同步到埋点模块
async function initUserTracking() {
  const userInfo = await getUserInfo();
  if (userInfo.userId !== 0) {
    setUserInfo({
      userId: userInfo.userId.toString(),
      companyId: userInfo.companyId.toString(),
      companyName: userInfo.companyName
    });
  }
}
```

## Mock 模式

在开发环境中，如果需要使用 Mock 数据而不调用真实的 `@plus/multi-account`，可以使用 Mock 版本：

```javascript
// 在开发环境中，可以临时替换导入
// import accountManager from './core';
import accountManager from './core.mock';

// 或者通过环境变量控制
const accountManager = process.env.NODE_ENV === 'development' 
  ? require('./core.mock').default 
  : require('./core').default;
```

Mock 版本提供了以下特性：

- 模拟登录状态
- 返回模拟的用户信息数据
- 支持手动触发账号变更事件进行测试

**Mock 测试示例：**

```javascript
import accountManager from '@/utils/account/core.mock';

// 模拟登录
accountManager.login();

// 获取 Mock 用户信息
const userInfo = await accountManager.getUserInfo();
console.log('Mock 用户信息:', userInfo);

// 注册账号变更监听
accountManager.onAccountChange((newUserInfo) => {
  console.log('账号变更:', newUserInfo);
});

// 手动触发账号变更（仅用于测试）
accountManager.mockAccountChange({
  userId: 123456789,
  nickName: "新用户",
  companyName: "新企业"
});
```

## 注意事项

1. **异步方法**：`getUserInfo()` 是异步方法，需要使用 `await` 或 `.then()` 处理
2. **错误处理**：`getUserInfo()` 在获取失败时会返回默认的未登录用户信息对象，不会抛出异常
3. **登录状态判断**：通过 `getUserInfo()` 获取用户信息后，判断 `userId !== 0` 来确定是否已登录。不再提供单独的 `checkLogin()` 方法，避免重复逻辑
4. **缓存机制**：`getUserInfo()` 支持缓存，已登录时默认返回缓存数据。需要最新数据时可传入 `forceRefresh: true`
5. **并发请求防护**：模块内部使用请求锁机制，防止短时间内重复调用 `getUserInfo()` 导致的并发请求问题
6. **账号变更监听**：`onAccountChange` 仅监听账号切换事件，退登操作不在监听范围内，需要单独处理
7. **退登功能**：`logout()` 方法当前未实现，@plus/multi-account 未提供退登接口，需要单独实现
8. **生产环境**：确保在生产环境中使用真实的 `core.impl.js`，而不是 `core.mock.js`

## 开发说明

- **真实实现**：`core.impl.js` 使用 `@plus/multi-account` SDK 实现真实的账号管理功能
- **Mock 实现**：`core.mock.js` 提供 Mock 实现，仅用于开发测试，不调用真实的 SDK

## 作者

`wuliangxing@wps.cn`
