import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { init as initReport } from './utils/report';

// 初始化埋点上报
initReport();

createApp(App).use(router).mount('#app')
