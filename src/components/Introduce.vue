<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import store from '@/store';
import Marked from '@/components/Marked/index.vue';

const props = defineProps(['path']);

const introduceRef = ref(true);
const visible = ref(true);
const fixed = ref(false);

// 组件挂载时添加监听
onMounted(() => {
  handleWindowScroll()
  window.addEventListener('scroll', handleWindowScroll, { passive: true });
})

// 组件卸载时移除监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll);
});

function changeVisible(val) {
  visible.value = val;
}


// 窗口滚动事件处理
const handleWindowScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const height = store.header?.offsetHeight || 0;
  fixed.value = scrollTop >= height;
};


defineExpose({ introduceRef });
</script>

<template>
  <div class="introduce-container">
    <div
      ref="introduceRef"
      class="introduce-box"
      :class="{'introduce-hidden': !visible, 'introduce-fixed': fixed}"
    >
      <div class="introduce-header">
        <h4 class="introduce-title">工具介绍</h4>
        <span class="introduce-btn" @click="changeVisible(false)"></span>
      </div>
      <div class="content">
        <Marked :path="props.path" />
      </div>
    </div>
    <div :class="'open-btn-box ' + (visible ? 'introduce-hidden' : 'visible')" :style="{position: fixed ? 'fixed' : 'absolute'}">
      <div class="open-btn">
        <h4 class="introduce-title">工具介绍</h4>
        <span class="introduce-btn" @click="changeVisible(true)"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduce-container {
  overflow: visible !important;
}
.introduce-box {
  width: 360px;
  height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  box-shadow:  0px 12px 48px 0px rgba(13, 13, 13, 0.14);
  background: #FFFFFF;
  transition: width 0.2s;
  overflow: hidden;
  position: relative;
  top: 0;
  z-index: 2;
}
.introduce-fixed {
  min-height: 100vh;
  position: sticky;
}
.introduce-box.introduce-hidden {
  width: 0;
}

.introduce-header {
  width: 360px;
  height: 76px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.introduce-title {
  width: auto;
  font-size: 18px;
  font-weight: 400;
  color: #333333;
}
.introduce-btn {
  width: 28px;
  height: 28px;
  display: block;
  background-image: url(./images/introduce-icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  cursor: pointer;
}
.introduce-btn:hover {
  background-image: url(./images/introduce-icon-hv.png);
}
.content {
  width: 360px;
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.open-btn-box {
  width: 148px;
  height: 52px;
  box-shadow:  0px 8px 16px 0px rgba(0, 0, 0, 0.12);
  background: #FFFFFF;
  border-radius: 12px;
  position: absolute;
  top: 20px;
  right: 20px;
  overflow: hidden;
  z-index: 1;
}
.open-btn {
  width: 148px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}
.open-btn-box.visible {
  animation: absoluteSlideIn 0.2s ease forwards;
}
@keyframes absoluteSlideIn {
  0% {
    width: 0;
    right: 0;
    opacity: 0;
  }
  20% {
    width: 80px;
    right: 0;
    opacity: 0.5;
  }
  40% {
    width: 148px;
    right: 0;
    opacity: 1;
  }
  100% {
    width: 148px;
    right: 20px;
    opacity: 1;
  }
}
.open-btn-box.introduce-hidden {
  animation: absoluteSlideOut 0.2s ease forwards;
}
@keyframes absoluteSlideOut {
  0% {
    width: 148px;
    right: 20px;
    opacity: 1;
  }
  60% {
    width: 148px;
    right: 0;
    opacity: 0.5;
  }
  80% {
    width: 80px;
    right: 0;
    opacity: 0;
  }
  100% {
    width: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
  }
}

@media screen and (max-width: 1920px) {
  .introduce-box {
    width: 200px;
    position: fixed;
    top: 36px;
    right: 0;
    z-index: 9;
  }
  
  .introduce-fixed {
    min-height: 100vh;
    position: fixed;
    top: 36px;
    right: 0;
  }
  .introduce-header {
    width: 200px;
    height: 56px;
    padding: 0 24px;
  }
  .introduce-title {
    font-size: 14px;
  }
  .introduce-btn {
    width: 20px;
    height: 20px;
  }

  .content {
    width: 200px;
    padding: 16px 24px;
  }
}
</style>