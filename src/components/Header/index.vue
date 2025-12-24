<script setup>
import { ref, onMounted } from 'vue';
import store from '@/store';
import account from '@/utils/account';

// 用户信息相关状态
const userInfo = ref({
  userId: null,
  nickName: '',
  avatarUrl: '',
  companyName: '',
  companyId: 0
});

const headerRef = ref(null);

onMounted(async () => {
  store.setHeader(headerRef.value);
  // await account.login();
  // await loadUserInfo();
})

// 获取用户信息
async function loadUserInfo(forceRefresh = false) {
  try {
    const info = await account.getUserInfo(forceRefresh);
    userInfo.value = info;
    console.log('用户信息:', info);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// 处理登录
async function handleLogin() {
  await account.login();
  // 登录后延迟获取用户信息（实际场景中可能需要在登录回调中处理）

  // mock 延时响应onAccountChange回调
  setTimeout(async () => {
    await loadUserInfo();
    if (userInfo.value.userId !== 0) {
      account.mockAccountChange(userInfo.value);
    }
  }, 1000);
}

</script>

<template>
  <div class="header" ref="headerRef">
    <slot></slot>
    <div class="user-info" v-if="userInfo.userId">
      <img class="avatar" :src="userInfo?.avatarUrl" alt="" />
    </div>
    <div class="login-btn" v-else @click="handleLogin">登录</div>
  </div>
</template>

<style src="./index.css" scoped></style>
