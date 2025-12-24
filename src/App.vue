<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import store from '@/store';

const route = useRoute()

// 监听路由变化
watch(
    () => route.fullPath,
    (newPath, oldPath) => {
      if (store.modal) store.setModal('');
    }
)

</script>

<template>
  <div class="app-root">
    <router-view />
  </div>
</template>

<style scoped>
.app-root {
  width: 100%;
  height: 100%;
}
</style>
