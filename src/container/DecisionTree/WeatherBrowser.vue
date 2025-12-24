<template>
  <div class="weather-dashboard">
    <aside class="sidebar" id="guide-sidebar">
      <div class="brand">🌤️ 气象数据中心</div>

      <div class="sidebar-content">
        <div class="panel-section">
          <h3 class="section-title">1. 数据控制</h3>
          <div class="action-card" id="guide-generate">
            <div class="card-label">模拟数据生成</div>
            <p class="card-desc">随机生成5个城市1000天的气象数据。</p>
            <button class="btn-primary" @click="generateData" :disabled="isProcessing">
              {{ isProcessing ? '⚡ 正在计算...' : '🔄 重新生成数据' }}
            </button>
          </div>
        </div>

        <div class="panel-section" v-if="allData.length > 0" id="guide-filter">
          <h3 class="section-title">2. 数据筛选与导出</h3>
          <button class="btn-outline" @click="downloadCSV">📥 导出当前表格 (CSV)</button>

          <div class="filter-group">
            <label>📍 城市筛选</label>
            <select v-model="filterCity">
              <option value="">全部城市</option>
              <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>☁️ 天气筛选</label>
            <select v-model="filterWeather">
              <option value="">全部天气</option>
              <option v-for="w in availableWeathers" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <div class="stats-mini">当前展示: <b>{{ filteredData.length }}</b> / {{ allData.length }} 条</div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="table-wrapper" id="guide-table">
        <div class="table-header">
          <div class="page-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredData.length) }} 条
          </div>

          <div class="right-controls">
            <button class="btn-help" @click="startGuide">❓ 引导指引</button>

            <div class="pagination">
              <button :disabled="currentPage === 1" @click="currentPage--">◀</button>
              <span>{{ currentPage }} / {{ totalPages }}</span>
              <button :disabled="currentPage === totalPages" @click="currentPage++">▶</button>
              <input class="jump-input" type="number" v-model.number="jumpPage" @keyup.enter="handleJump" placeholder="页">
            </div>
          </div>
        </div>

        <div class="table-scroll-container">
          <table class="data-table">
            <thead>
            <tr>
              <th width="60">序号</th><th width="120">日期</th><th width="100">地点</th>
              <th width="100">天气</th><th width="100">温度</th><th>风力等级可视化</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in paginatedData" :key="index">
              <td class="col-idx">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ row.date }}</td>
              <td><span class="city-tag">{{ row.location }}</span></td>
              <td><span class="weather-badge" :class="getWeatherClass(row.weather)">{{ getWeatherIcon(row.weather) }} {{ row.weather }}</span></td>
              <td class="temp-cell" :class="getTempClass(row.temp)">{{ row.temp }}℃</td>
              <td>
                <div class="wind-wrapper">
                  <span class="wind-text">{{ row.wind }}级</span>
                  <div class="wind-track"><div class="wind-bar" :style="{ width: (row.wind * 10) + '%', background: getWindColor(row.wind) }"></div></div>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="6" class="no-data-row">{{ isProcessing ? '正在生成数据...' : '没有符合筛选条件的数据' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <Introduce :path="'/tool-introduce/weather-browser/guide.md'" />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import guide from '@/utils/guide';
import Introduce from '@/components/Introduce.vue';

// --- 状态管理 ---
const isProcessing = ref(false);
const allData = ref([]);

// 筛选与分页
const filterCity = ref('');
const filterWeather = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const jumpPage = ref('');

// --- 常量 ---
const CITIES = [
  { name: '哈尔滨', baseTemp: 4 }, { name: '北京', baseTemp: 12 },
  { name: '上海', baseTemp: 16 }, { name: '广州', baseTemp: 22 }, { name: '昆明', baseTemp: 15 }
];
const WEATHERS = ['晴', '多云', '阴', '雨', '雪'];

// --- 生命周期 ---
onMounted(async () => {
  await generateData();
  nextTick(() => { startGuide(); });
});

// --- 引导配置 ---
const startGuide = () => {
  const steps = [
    { element: '#guide-sidebar', popover: { title: '控制面板', description: '这里是您的数据指挥中心，可以生成、筛选和下载数据。', side: "right", align: 'start' } },
    { element: '#guide-generate', popover: { title: '模拟数据生成', description: '点击这里可以重新生成 5000 条包含季节性规律的模拟气象数据。', side: "right", align: 'center' } },
    { element: '#guide-filter', popover: { title: '筛选与导出', description: '您可以按城市或天气筛选数据，并将结果导出为 CSV 文件用于后续分析。', side: "right", align: 'center' } },
    { element: '#guide-table', popover: { title: '数据展示区', description: '这里展示了所有气象数据的明细，包含了温度颜色标记和风力可视化条。', side: "left", align: 'start' } }
  ];
  guide(steps);
};

// --- 核心逻辑 ---
const generateData = async () => {
  isProcessing.value = true;
  await new Promise(r => setTimeout(r, 300));
  const result = [];
  const startDate = new Date('2023-01-01');
  CITIES.forEach(cityInfo => {
    for (let i = 0; i < 1000; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const seasonFactor = -Math.cos((i / 365) * 2 * Math.PI);
      const temp = Math.round(cityInfo.baseTemp + (seasonFactor * 15) + ((Math.random() * 6) - 3));
      let wWeights = temp < 0 ? [0.4, 0.2, 0.1, 0.0, 0.3] : [0.4, 0.3, 0.2, 0.1, 0.0];
      const weather = weightedRandom(WEATHERS, wWeights);
      const wind = Math.max(1, Math.min(10, Math.floor(Math.random() * 8) + 1));
      result.push({ date: dateStr, location: cityInfo.name, weather, temp, wind });
    }
  });
  allData.value = result;
  filterCity.value = ''; filterWeather.value = ''; currentPage.value = 1; isProcessing.value = false;
};

const weightedRandom = (items, weights) => {
  let total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) return items[i];
    random -= weights[i];
  }
  return items[0];
};

const downloadCSV = () => {
  if (allData.value.length === 0) return;
  const headers = ['日期,地点,天气,温度(℃),风力'];
  const rows = allData.value.map(d => `${d.date},${d.location},${d.weather},${d.temp},${d.wind}`);
  const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `气象数据_${allData.value.length}条.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- 计算属性 & 辅助函数 ---
const availableCities = computed(() => [...new Set(allData.value.map(d => d.location))]);
const availableWeathers = computed(() => [...new Set(allData.value.map(d => d.weather))]);
const filteredData = computed(() => {
  return allData.value.filter(item => {
    const matchCity = filterCity.value ? item.location === filterCity.value : true;
    const matchWeather = filterWeather.value ? item.weather === filterWeather.value : true;
    return matchCity && matchWeather;
  });
});
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value) || 1);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});
watch([filterCity, filterWeather], () => { currentPage.value = 1; });
const handleJump = () => {
  let p = parseInt(jumpPage.value);
  if (p >= 1 && p <= totalPages.value) currentPage.value = p;
  jumpPage.value = '';
};
const getWeatherIcon = (w) => { if (w.includes('晴')) return '☀️'; if (w.includes('雨')) return '🌧️'; if (w.includes('雪')) return '❄️'; if (w.includes('阴')) return '☁️'; return '⛅'; };
const getWeatherClass = (w) => { if (w.includes('晴')) return 'badge-sunny'; if (w.includes('雨')) return 'badge-rainy'; if (w.includes('雪')) return 'badge-snowy'; return 'badge-cloudy'; };
const getTempClass = (t) => t >= 30 ? 'text-hot' : (t <= 0 ? 'text-cold' : '');
const getWindColor = (w) => { if (w <= 3) return '#67c23a'; if (w <= 6) return '#e6a23c'; return '#f56c6c'; };
</script>

<style scoped>
/* 保持原有布局样式 */
.weather-dashboard { display: flex; height: 100vh; background-color: #f0f2f5; font-family: 'Segoe UI', sans-serif; color: #333; }
.sidebar { width: 280px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; flex-shrink: 0; z-index: 10; }
.brand { height: 60px; display: flex; align-items: center; padding: 0 20px; font-size: 18px; font-weight: bold; color: #409eff; border-bottom: 1px solid #eee; background: #fdfdfd; }
.sidebar-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 25px; }
.section-title { font-size: 13px; text-transform: uppercase; color: #909399; margin-bottom: 10px; letter-spacing: 1px; font-weight: 700; }
.action-card { background: #f9fafc; border: 1px solid #ebeef5; border-radius: 8px; padding: 15px; transition: 0.3s; }
.action-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #dcdfe6; }
.card-label { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 5px; }
.card-desc { font-size: 12px; color: #909399; margin-bottom: 10px; line-height: 1.4; }
.btn-primary { width: 100%; background: #409eff; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-primary:hover { background: #66b1ff; }
.btn-primary:disabled { background: #a0cfff; cursor: not-allowed; }
.btn-outline { width: 100%; background: #fff; color: #606266; border: 1px solid #dcdfe6; padding: 8px; border-radius: 4px; cursor: pointer; margin-bottom: 15px; font-size: 13px; }
.btn-outline:hover { color: #409eff; border-color: #c6e2ff; background: #ecf5ff; }
.filter-group { margin-bottom: 15px; }
.filter-group label { display: block; font-size: 12px; color: #606266; margin-bottom: 5px; }
.filter-group select { width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 13px; color: #333; }
.stats-mini { font-size: 12px; color: #909399; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
.table-wrapper { flex: 1; display: flex; flex-direction: column; margin: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); overflow: hidden; }
.table-header { padding: 10px 20px; padding-right: 180px; background: #fdfdfd; border-bottom: 1px solid #ebeef5; display: flex; justify-content: space-between; align-items: center; height: 50px; }
.right-controls { display: flex; align-items: center; gap: 10px; }
.btn-help { background: rgba(64, 158, 255, 0.1); color: #409eff; border: 1px solid #a0cfff; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; white-space: nowrap; }
.btn-help:hover { background: #409eff; color: white; }
.btn-help.secondary { background: #f4f4f5; color: #606266; border-color: #dcdfe6; }
.btn-help.secondary:hover { background: #e6e6e6; }
.page-info { font-size: 13px; color: #606266; }
.pagination { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.pagination button { border: 1px solid #dcdfe6; background: #fff; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pagination button:hover:not(:disabled) { border-color: #409eff; color: #409eff; }
.pagination button:disabled { background: #f5f5f5; cursor: not-allowed; color: #c0c4cc; }
.jump-input { width: 40px; text-align: center; border: 1px solid #dcdfe6; border-radius: 4px; padding: 4px; outline: none; }
.jump-input:focus { border-color: #409eff; }
.table-scroll-container { flex: 1; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { background: #f5f7fa; color: #606266; padding: 12px 15px; text-align: left; font-weight: 600; position: sticky; top: 0; z-index: 2; border-bottom: 1px solid #ebeef5; }
.data-table td { padding: 10px 15px; border-bottom: 1px solid #ebeef5; color: #606266; }
.data-table tr:hover { background-color: #f9fafc; }
.col-idx { color: #c0c4cc; font-size: 12px; }
.city-tag { font-weight: 500; color: #303133; }
.weather-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.badge-sunny { background: #fdf6ec; color: #e6a23c; }
.badge-rainy { background: #ecf5ff; color: #409eff; }
.badge-snowy { background: #f4f4f5; color: #909399; }
.badge-cloudy { background: #f0f9eb; color: #67c23a; }
.temp-cell { font-family: Consolas, monospace; font-weight: 600; }
.text-hot { color: #f56c6c; }
.text-cold { color: #409eff; }
.wind-wrapper { display: flex; align-items: center; gap: 10px; }
.wind-text { width: 35px; font-size: 12px; }
.wind-track { flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; max-width: 80px; overflow: hidden; }
.wind-bar { height: 100%; border-radius: 3px; }
.no-data-row { text-align: center; padding: 40px; color: #909399; font-style: italic; }
</style>